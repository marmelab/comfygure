import 'babel-polyfill';
import expect from 'expect';
import call from 'sg.js/dist/effects/call';

import fetchConfig from './fetch/fetchConfig';
import updateConfig from './fetch/updateConfig';
import { decryptConfig, encryptConfig, getConfigSaga, updateConfigSaga } from './provideConfigState';
import toFlat from './utils/toFlat';

describe('getConfigSaga', () => {
    const args = {
        projectId: 'foo',
        configName: 'default',
        environmentName: 'development',
        secret: 'big_secret',
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
            const { secret, ...fetchArgs } = args;
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, fetchArgs));
        });

        it('decrypt the fetched config', () => {
            const effect = saga.next({ body: 'result' }).value;
            expect(effect).toEqual(call(decryptConfig, 'result', 'big_secret'));
        });

        it('sets the config state to the decrypted config', () => {
            const effect = saga.next('decrypted').value;
            expect(effect).toEqual(call('setConfig', 'decrypted'));
        });
    });

    describe('could not fetch config without error', () => {
        const saga = getSaga();

        it('fetches the config', () => {
            const { secret, ...fetchArgs } = args;
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
        secret: 'big_secret',
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

    it('sets the loading state to true', () => {
        const effect = saga.next().value;
        expect(effect).toEqual(call('setLoading', true));
    });

    it('flattens the new config', () => {
        const effect = saga.next().value;
        expect(effect).toEqual(call(toFlat, { foo: 'bar' }));
    });

    it('encrypts the new config', () => {
        const effect = saga.next({ foo: 'flatten' }).value;
        expect(effect).toEqual(call(encryptConfig, { foo: 'flatten' }, 'big_secret'));
    });

    it('calls the api to update the new config', () => {
        const { secret, config, ...fetchArgs } = args;
        const effect = saga.next('encrypted').value;
        expect(effect).toEqual(call(updateConfig, { ...fetchArgs, config: 'encrypted' }));
    });

    it('sets the loading state to false', () => {
        const effect = saga.next({ body: 'result' }).value;
        expect(effect).toEqual(call('setLoading', false));
    });
});
