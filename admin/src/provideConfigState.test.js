import 'babel-polyfill';
import expect from 'expect';
import call from 'sg.js/dist/effects/call';

import fetchConfig from './fetch/fetchConfig';
import updateConfig from './fetch/updateConfig';
import {
    decryptConfig,
    encryptConfig,
    getConfigSaga,
    removeConfigKeySaga,
    updateConfigSaga,
    updateConfigKeySaga,
    state,
} from './provideConfigState';
import toFlat from './utils/toFlat';

describe('getConfigSaga', () => {
    const args = {
        projectId: 'foo',
        configName: 'default',
        environmentName: 'development',
        passphrase: 'big_passphrase',
    };

    const getSaga = () =>
        getConfigSaga(
            {
                setLoading: 'setLoading',
                setError: 'setError',
                setConfig: 'setConfig',
            },
            args,
        );

    describe('successfully fetched config', () => {
        const saga = getSaga();

        it('fetches the config', () => {
            const { passphrase, ...fetchArgs } = args;
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, fetchArgs));
        });

        it('decrypt the fetched config', () => {
            const effect = saga.next({ body: 'result' }).value;
            expect(effect).toEqual(call(decryptConfig, 'result', 'big_passphrase'));
        });

        it('sets the config state to the decrypted config', () => {
            const effect = saga.next('decrypted').value;
            expect(effect).toEqual(call('setConfig', 'decrypted'));
        });
    });

    describe('could not fetch config without error', () => {
        const saga = getSaga();

        it('fetches the config', () => {
            const { passphrase, ...fetchArgs } = args;
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, fetchArgs));
        });

        it('sets the error state if the fetched config is null', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call('setError', 'Not found'));
        });
    });
});

describe('updateConfigSaga', () => {
    const args = {
        projectId: 'foo',
        configName: 'default',
        environmentName: 'development',
        passphrase: 'big_passphrase',
        config: { foo: 'bar' },
    };

    const getSaga = () =>
        updateConfigSaga(
            {
                setLoading: 'setLoading',
                setError: 'setError',
                setConfig: 'setConfig',
            },
            args,
        );

    const saga = getSaga();

    it('flattens the new config', () => {
        const effect = saga.next().value;
        expect(effect).toEqual(call(toFlat, { foo: 'bar' }));
    });

    it('encrypts the new config', () => {
        const effect = saga.next({ foo: 'flatten' }).value;
        expect(effect).toEqual(call(encryptConfig, { foo: 'flatten' }, 'big_passphrase'));
    });

    it('calls the api to update the new config', () => {
        const { passphrase, config, ...fetchArgs } = args;
        const effect = saga.next('encrypted').value;
        expect(effect).toEqual(call(updateConfig, { ...fetchArgs, config: 'encrypted' }));
    });
});

describe('updateConfigKeySaga', () => {
    const args = {
        projectId: 'foo',
        configName: 'default',
        environmentName: 'development',
        passphrase: 'big_passphrase',
        config: { foo: 'bar' },
        key: { name: 'bar', value: 'foo' },
    };

    const getSaga = () =>
        updateConfigKeySaga(
            {
                setLoading: 'setLoading',
                setError: 'setError',
                setConfig: 'setConfig',
            },
            args,
        );

    const saga = getSaga();

    it('flattens the new config', () => {
        const effect = saga.next().value;
        expect(effect).toEqual(call(toFlat, { foo: 'bar', bar: 'foo' }));
    });

    it('encrypts the new config', () => {
        const effect = saga.next({ foo: 'flatten' }).value;
        expect(effect).toEqual(call(encryptConfig, { foo: 'flatten' }, 'big_passphrase'));
    });

    it('calls the api to update the new config', () => {
        const { passphrase, config, key, ...fetchArgs } = args;
        const effect = saga.next('encrypted').value;
        expect(effect).toEqual(call(updateConfig, { ...fetchArgs, config: 'encrypted' }));
    });
});

describe('removeConfigKeySaga', () => {
    const args = {
        key: 'bar',
        projectId: 'foo',
        configName: 'default',
        environmentName: 'development',
        passphrase: 'big_passphrase',
        config: { foo: 'bar', bar: 'foo' },
    };

    const getSaga = () =>
        removeConfigKeySaga(
            {
                setLoading: 'setLoading',
                setError: 'setError',
                setConfig: 'setConfig',
            },
            args,
        );

    const saga = getSaga();

    it('flattens the new config', () => {
        const effect = saga.next().value;
        expect(effect).toEqual(call(toFlat, { foo: 'bar' }));
    });

    it('encrypts the new config', () => {
        const effect = saga.next({ foo: 'flatten' }).value;
        expect(effect).toEqual(call(encryptConfig, { foo: 'flatten' }, 'big_passphrase'));
    });

    it('calls the api to update the new config', () => {
        const { passphrase, config, key, ...fetchArgs } = args;
        const effect = saga.next('encrypted').value;
        expect(effect).toEqual(call(updateConfig, { ...fetchArgs, config: 'encrypted' }));
    });
});

describe('state.computed.filteredConfig', () => {
    const filteredConfigSelector = state.computed.filteredConfig;

    it('should return config if search is an empty string', () => {
        expect(filteredConfigSelector({ config: { foo: 1, bar: 2, baz: 3 }, search: '' })).toEqual({
            foo: 1,
            bar: 2,
            baz: 3,
        });
    });

    it('should return only key matching search', () => {
        expect(filteredConfigSelector({ config: { foo: 1, bar: 2, baz: 3 }, search: 'ba' })).toEqual({
            bar: 2,
            baz: 3,
        });
    });

    it('should return empty object if no key match search', () => {
        expect(filteredConfigSelector({ config: { foo: 1, bar: 2, baz: 3 }, search: 'bam' })).toEqual({});
    });

    it('should ignore the case', () => {
        expect(filteredConfigSelector({ config: { foo: 1, bar: 2, baz: 3, BAR: 4 }, search: 'bar' })).toEqual({
            bar: 2,
            BAR: 4,
        });
    });
});
