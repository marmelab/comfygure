import { provideState, softUpdate } from 'freactal';

export const state = {
    initialState: ({ origin = '', projectId = '', secret = '', token = '' }) => ({
        origin,
        projectId,
        token,
        secret,
        environments: undefined,
        environmentName: 'development',
    }),
    effects: {
        persistConfig: (effects, { origin, projectId, token, secret }) => {
            sessionStorage.setItem('comfy.origin', origin);
            sessionStorage.setItem('comfy.projectId', projectId);
            sessionStorage.setItem('comfy.token', token);
            sessionStorage.setItem('comfy.secret', secret);
        },
        setConfig: (effects, config) =>
            effects.persistConfig(config).then(
                softUpdate(() => ({
                    origin: config.origin,
                    projectId: config.projectId,
                    token: config.token,
                    secret: config.secret,
                })),
            ),
        setEnvironments: softUpdate((state, environments) => ({
            environments,
        })),
        setEnvironment: softUpdate((state, environmentName) => ({
            environmentName,
        })),
    },
};

export default provideState(state);
