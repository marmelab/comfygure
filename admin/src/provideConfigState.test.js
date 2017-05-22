import 'babel-polyfill';
import expect from 'expect';
import call from 'sg.js/dist/effects/call';

import fetchConfig from './fetch/fetchConfig';
import { decryptConfig, getConfigSaga } from './provideConfigState';

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

describe('getConfigSaga', () => {
    describe('successfully fetched config', () => {
        const saga = getSaga();

        it('sets the loading state to true', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call('setLoading', true));
        });

        it('fetches the config', () => {
            const { secret, ...fetchArgs } = args;
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, fetchArgs));
        });

        it('sets the loading state to false', () => {
            const effect = saga.next({ body: 'result' }).value;
            expect(effect).toEqual(call('setLoading', false));
        });

        it('decrypt the fetched config', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(decryptConfig, 'result', 'big_secret'));
        });

        it('sets the config state to the decrypted config', () => {
            const effect = saga.next('decrypted').value;
            expect(effect).toEqual(call('setConfig', 'decrypted'));
        });
    });

    describe('could not fetch config without error', () => {
        const saga = getSaga();

        it('sets the loading state to true', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call('setLoading', true));
        });

        it('fetches the config', () => {
            const { secret, ...fetchArgs } = args;
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, fetchArgs));
        });

        it('sets the loading state to false', () => {
            const effect = saga.next(null).value;
            expect(effect).toEqual(call('setLoading', false));
        });

        it('sets the error state if the fetched config is null', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call('setError', 'Not found'));
        });
    });
});
