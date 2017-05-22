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

export const decryptConfig = (config, secret) =>
    Object.keys(config).reduce((acc, key) => {
        const value = config[key];

        if (!isNullValue(value)) {
            return {
                ...acc,
                [key]: decrypt(value.toString(), secret),
            };
        }

        return acc;
    }, {});

export const getConfigSaga = function*(effects, { secret, ...args }) {
    yield call(effects.setLoading, true);
    const config = yield call(fetchConfig, args);
    yield call(effects.setLoading, false);

    if (config) {
        const decryptedConfig = yield call(decryptConfig, config.body, secret);
        yield call(effects.setConfig, decryptedConfig);
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
