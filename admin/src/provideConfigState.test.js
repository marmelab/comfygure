import 'babel-core/register';
import 'babel-polyfill';

import expect from 'expect';
import call from 'sg.js/dist/effects/call';
import { getConfigSaga, effects, fetchConfig } from './provideConfigState';

const getSaga = () =>
    getConfigSaga(effects)({
        projectId: 'foo',
        configName: 'default',
        environment: { name: 'development' },
    });

describe('getConfigSaga', () => {
    describe('successfully fetched config', () => {
        const saga = getSaga();

        it('sets the loading state to true', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(effects.setLoading, true));
        });

        it('fetches the config', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, 'foo', 'development', 'default'));
        });

        it('sets the loading state to false', () => {
            const effect = saga.next('result').value;
            expect(effect).toEqual(call(effects.setLoading, false));
        });

        it('sets the config state to the fetched config', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(effects.setConfig, 'result'));
        });
    });

    describe('could not fetch config without error', () => {
        const saga = getSaga();

        it('sets the loading state to true', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(effects.setLoading, true));
        });

        it('fetches the config', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(fetchConfig, 'foo', 'development', 'default'));
        });

        it('sets the loading state to false', () => {
            const effect = saga.next(null).value;
            expect(effect).toEqual(call(effects.setLoading, false));
        });

        it('sets the error state if the fetched config is null', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(effects.setError, 'Not found'));
        });
    });

    describe('could not fetch config with error', () => {
        const saga = getSaga();

        it('sets the loading state to true', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(effects.setLoading, true));
        });

        it('sets the loading state to false if an error is thrown', () => {
            const effect = saga.throw({ message: 'Run you fools!' }).value;
            expect(effect).toEqual(call(effects.setLoading, false));
        });

        it('sets the error state if an error is thrown', () => {
            const effect = saga.next().value;
            expect(effect).toEqual(call(effects.setError, 'Run you fools!'));
        });
    });
});
