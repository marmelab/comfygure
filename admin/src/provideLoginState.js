import 'babel-polyfill';
import sg from 'sg.js';
import { call } from 'sg.js/dist/effects';
import { provideState, softUpdate } from 'freactal';

import fetchState from './fetch/state';
import wrapWithLoading from './utils/wrapWithLoading';
import wrapWithErrorHandling from './utils/wrapWithErrorHandling';
import fetchEnvironments from './fetch/fetchEnvironments';
import { DEFAULT_ORIGIN } from './constants';

export function* submit(effects, { origin, projectId, token, secret }) {
    yield call(effects.setLoading, true);
    const environments = (yield call(fetchEnvironments, { origin, projectId, token })) || [];
    yield call(effects.setLoading, false);
    yield call(effects.setConfig, {
        origin,
        projectId,
        secret,
        token,
    });
    yield call(effects.setEnvironments, environments);
}

export const state = {
    initialState: () => ({
        ...fetchState.state,
        origin: DEFAULT_ORIGIN,
        projectId: '',
        secret: '',
        token: '',
    }),
    effects: {
        ...fetchState.effects,
        onOriginChange: softUpdate((state, event, origin) => ({ origin })),
        onProjectIdChange: softUpdate((state, event, projectId) => ({ projectId })),
        onSecretChange: softUpdate((state, event, secret) => ({ secret })),
        onTokenChange: softUpdate((state, event, token) => ({ token })),
        submit: wrapWithLoading(wrapWithErrorHandling((effects, args) => sg(submit)(effects, args))),
    },
};

export default provideState(state);
