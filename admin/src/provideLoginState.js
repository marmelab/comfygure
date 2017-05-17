import 'babel-polyfill';
import sg from 'sg.js';
import { call } from 'sg.js/dist/effects';
import { provideState, softUpdate } from 'freactal';

import fetchEnvironments from './fetch/fetchEnvironments';

export function* submit(effects, { projectId, token, secret }) {
    try {
        yield call(effects.setPending);
        const environments = yield call(fetchEnvironments, { projectId, token });
        yield call(effects.unsetPending);
        yield call(effects.setConfig, {
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
        projectId: '',
        token: '',
        secret: '',
        pending: false,
    }),
    effects: {
        setPending: () => state => ({ ...state, pending: true }),
        unsetPending: softUpdate(() => ({ pending: false })),
        onTokenChange: softUpdate((state, event, token) => ({ token })),
        onSecretChange: softUpdate((state, event, secret) => ({ secret })),
        onProjectIdChange: softUpdate((state, event, projectId) => ({ projectId })),
        submit: sg(submit),
    },
};

export default provideState(state);
