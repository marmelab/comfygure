import { provideState, softUpdate } from 'freactal';
import sg from 'sg.js';
import call from 'sg.js/dist/effects/call';

import fetchState from './fetch/state';
import fetchConfig from './fetch/fetchConfig';

export const getConfigSaga = effects =>
    function*(state) {
        // Store a reference to the environment name here as state is mutated later (don't know why)
        const environmentName = state.environment.name;
        const projectId = state.projectId;
        const configName = state.configName;

        yield call(effects.setLoading, true);
        const config = yield call(fetchConfig, projectId, environmentName, configName);
        yield call(effects.setLoading, false);

        if (config) {
            yield call(effects.setConfig, config);
        } else {
            yield call(effects.setError, 'Not found');
        }
    };

export const state = {
    initialState: ({ environment }) => ({
        ...fetchState.state,
        config: null,
        error: null,
        environment,
        loading: false,
    }),
    effects: {
        ...fetchState.effects,
        setConfig: softUpdate((state, config) => ({ config })),
        getConfig: effects => sg(getConfigSaga(effects)),
    },
};

export default provideState(state);
