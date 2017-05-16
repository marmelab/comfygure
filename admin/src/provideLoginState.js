import 'babel-polyfill';
import sg from 'sg.js';
import { call } from 'sg.js/dist/effects';
import { provideState, softUpdate } from 'freactal';
import fetch from 'isomorphic-fetch';
import handleFetchResponse from './utils/handleFetchResponse';
import pipeAsync from './utils/pipeAsync';

export const getEnvironmentRequest = ({ projectId, token }) =>
    new Request(`http://localhost:3000/projects/${projectId}/environments`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
    });

export const fetchEnvironments = (projectId, token) =>
    pipeAsync(getEnvironmentRequest, fetch, handleFetchResponse)({ projectId, token });

export function* submit(effects, { projectId, token, secret }) {
    try {
        yield call(effects.setPending);
        const environments = yield call(fetchEnvironments, projectId, token);
        yield call(effects.unsetPending);
        yield call(effects.setEnvironments, environments);
        yield call(effects.setProjectId, projectId);
        yield call(effects.setToken, token);
        yield call(effects.setSecret, secret);
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
