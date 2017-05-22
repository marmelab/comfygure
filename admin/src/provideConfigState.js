import { provideState, softUpdate } from 'freactal';
import sg from 'sg.js';
import call from 'sg.js/dist/effects/call';

import fetchState from './fetch/state';
import wrapWithLoading from './utils/wrapWithLoading';
import wrapWithErrorHandling from './utils/wrapWithErrorHandling';
import fetchConfig from './fetch/fetchConfig';
import { decrypt } from './utils/crypto';

// `null` and `undefined` are the only types that we cannot stringify
const isNullValue = value => value === null || value === undefined;

export const getConfigSaga = function*(effects, { secret, ...args }) {
    yield call(effects.setLoading, true);
    const { body: config } = yield call(fetchConfig, args);
    yield call(effects.setLoading, false);

    if (config) {
        Object.keys(config).forEach(key => {
            const value = config[key];

            if (!isNullValue(value)) {
                config[key] = decrypt(value.toString(), secret);
            }
        });

        yield call(effects.setConfig, config);
        yield call(effects.setError, undefined);
    } else {
        yield call(effects.setError, 'Not found');
    }
};

export const state = {
    initialState: () => ({
        ...fetchState.state,
        config: undefined,
        error: undefined,
        loading: false,
    }),
    effects: {
        ...fetchState.effects,
        setConfig: softUpdate((state, config) => ({ config })),
        getConfig: wrapWithErrorHandling(wrapWithLoading((effects, args) => sg(getConfigSaga)(effects, args))),
    },
};

export default provideState(state);
