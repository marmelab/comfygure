import 'babel-core/register';
import 'babel-polyfill';

import expect from 'expect';
import call from 'sg.js/dist/effects/call';
import { getConfigSaga, effects, fetchConfig } from './provideConfigState';

describe('getConfigSaga', () => {
    const saga = getConfigSaga(effects)({
        projectId: 'foo',
        configName: 'default',
        environment: { name: 'development' },
    });

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
        expect(effect).toEqual(call(effects.setFetchResult, 'result'));
    });
});
