import 'babel-polyfill';
import expect from 'expect';
import call from 'sg.js/dist/effects/call';

import fetchConfig from './fetch/fetchConfig';
import { getConfigSaga } from './provideConfigState';

const getSaga = () =>
    getConfigSaga({
        setLoading: 'setLoading',
        setError: 'setError',
        setConfig: 'setConfig',
    })({
        projectId: 'foo',
        configName: 'default',
        environment: { name: 'development' },
    });

describe('getConfigSaga', () => {
    describe('successfully fetched config', () => {
        const saga = getSaga();

        it('sets the loading state to true', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call('setLoading', true));
        });

        it('fetches the config', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, 'foo', 'development', 'default'));
        });

        it('sets the loading state to false', () => {
            const effect = saga.next('result').value;
            expect(effect).toEqual(call('setLoading', false));
        });

        it('sets the config state to the fetched config', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call('setConfig', 'result'));
        });
    });

    describe('could not fetch config without error', () => {
        const saga = getSaga();

        it('sets the loading state to true', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call('setLoading', true));
        });

        it('fetches the config', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, 'foo', 'development', 'default'));
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
