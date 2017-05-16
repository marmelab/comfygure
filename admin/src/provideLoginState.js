import { provideState, softUpdate, hardUpdate } from "freactal";
import fetch from 'isomorphic-fetch';
import handleFetchResponse from './utils/handleFetchResponse';

export const submit = (effects, { projectId, token, secret }) =>
    effects.setPending()
        .then(() => new Request(`http://localhost:3000/projects/${projectId}/environments`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
        }))
        .then(fetch)
        .then(handleFetchResponse)
        .then(
            response =>
                effects.setEnvironments(response)
                    .then(effects.unsetPending())
                    .then(effects.setProjectId(projectId))
                    .then(effects.setToken(token))
                    .then(effects.setSecret(secret)),
            error =>
                effects.setError(error)
                    .then(effects.unsetPending),
        );

export const state = {
    initialState: () => ({
        projectId: '',
        token: '',
        secret: '',
        pending: false,
    }),
    effects: {
        setPending: () => state => console.log('setPending') || ({ ...state,  pending: true }),
        unsetPending: softUpdate(state => ({ pending: false })),
        onTokenChange: softUpdate((state, event, token) => ({ token })),
        onSecretChange: softUpdate((state, event, secret) => ({ secret })),
        onProjectIdChange: softUpdate((state, event, projectId) => ({ projectId })),
        submit,
    },
};

export default provideState(state);
