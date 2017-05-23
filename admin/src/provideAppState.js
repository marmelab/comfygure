import { provideState, softUpdate } from 'freactal';

export const state = {
    initialState: ({ origin = '', projectId = '', passphrase = '', token = '' }) => ({
        origin,
        projectId,
        token,
        passphrase,
        environments: undefined,
        environmentName: 'development',
    }),
    effects: {
        persistConfig: (effects, { origin, projectId, token, passphrase }) => {
            sessionStorage.setItem('comfy.origin', origin);
            sessionStorage.setItem('comfy.projectId', projectId);
            sessionStorage.setItem('comfy.token', token);
            sessionStorage.setItem('comfy.passphrase', passphrase);
        },
        setConfig: (effects, config) =>
            effects.persistConfig(config).then(
                softUpdate(() => ({
                    origin: config.origin,
                    projectId: config.projectId,
                    token: config.token,
                    passphrase: config.passphrase,
                })),
            ),
        setEnvironments: softUpdate((state, environments) => ({
            environments,
        })),
        setEnvironment: softUpdate((state, environmentName) => ({
            environmentName,
        })),
    },
    computed: {
        isLoggedIn: ({ token, passphrase }) => !!token && !!passphrase,
    },
};

export default provideState(state);
