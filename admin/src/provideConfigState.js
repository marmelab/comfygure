import { provideState, softUpdate } from 'freactal';
import sg from 'sg.js';
import call from 'sg.js/dist/effects/call';

import fetchState from './fetch/state';
import wrapWithLoading from './utils/wrapWithLoading';
import wrapWithErrorHandling from './utils/wrapWithErrorHandling';
import fetchConfig from './fetch/fetchConfig';

export const getConfigSaga = function*(effects, args) {
    yield call(effects.setLoading, true);
    const config = yield call(fetchConfig, args);
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
        getConfig: wrapWithErrorHandling(wrapWithLoading((effects, args) => sg(getConfigSaga)(effects, args))),
    },
};

export default provideState(state);
