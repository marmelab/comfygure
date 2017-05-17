import 'babel-polyfill';
import sg from 'sg.js';
import { call } from 'sg.js/dist/effects';
import { provideState, softUpdate } from 'freactal';

import fetchEnvironments from './fetch/fetchEnvironments';
import { DEFAULT_ORIGIN } from './constants';
export function* submit(effects, { origin, projectId, token, secret }) {
    try {
        yield call(effects.setPending);
        const environments = (yield call(fetchEnvironments, { origin, projectId, token })) || [];
        yield call(effects.unsetPending);
        yield call(effects.setConfig, {
            origin,
            projectId,
            token,
            secret,
        });
        yield call(effects.setEnvironments, environments);
    } catch (error) {
        yield call(effects.unsetPending);
        yield call(effects.setError, error.message);
    }
}

export const state = {
    initialState: () => ({
        origin: DEFAULT_ORIGIN,
        projectId: '',
        token: '',
        secret: '',
        pending: false,
    }),
    effects: {
        setPending: () => state => ({ ...state, pending: true }),
        unsetPending: softUpdate(() => ({ pending: false })),
        onOriginChange: softUpdate((state, event, origin) => ({ origin })),
        onTokenChange: softUpdate((state, event, token) => ({ token })),
        onSecretChange: softUpdate((state, event, secret) => ({ secret })),
        onProjectIdChange: softUpdate((state, event, projectId) => ({ projectId })),
        submit: sg(submit),
    },
};

export default provideState(state);
