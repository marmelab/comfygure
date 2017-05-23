import 'babel-polyfill';
import sg from 'sg.js';
import { call } from 'sg.js/dist/effects';
import { provideState, softUpdate } from 'freactal';

import fetchState from './fetch/state';
import wrapWithLoading from './utils/wrapWithLoading';
import wrapWithErrorHandling from './utils/wrapWithErrorHandling';
import fetchEnvironments from './fetch/fetchEnvironments';
import { DEFAULT_ORIGIN } from './constants';

export function* submit(effects, { origin, projectId, token, passphrase }) {
    yield call(effects.setLoading, true);
    const environments = (yield call(fetchEnvironments, { origin, projectId, token })) || [];
    yield call(effects.setLoading, false);
    yield call(effects.setConfig, {
        origin,
        projectId,
        passphrase,
        token,
    });
    yield call(effects.setEnvironments, environments);
}

export const state = {
    initialState: ({ origin, projectId, passphrase, token }) => ({
        ...fetchState.state,
        origin: sessionStorage.getItem('comfy.origin') || origin || DEFAULT_ORIGIN,
        projectId: sessionStorage.getItem('comfy.projectId') || projectId,
        passphrase: sessionStorage.getItem('comfy.passphrase') || passphrase,
        token: sessionStorage.getItem('comfy.token') || token,
    }),
    effects: {
        ...fetchState.effects,
        onOriginChange: softUpdate((state, event, origin) => ({ origin })),
        onProjectIdChange: softUpdate((state, event, projectId) => ({ projectId })),
        onpassphraseChange: softUpdate((state, event, passphrase) => ({ passphrase })),
        onTokenChange: softUpdate((state, event, token) => ({ token })),
        submit: wrapWithErrorHandling(wrapWithLoading((effects, args) => sg(submit)(effects, args))),
    },
};

export default provideState(state);
