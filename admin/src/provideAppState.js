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
        setConfig: softUpdate((state, { origin, projectId, token, secret }) => ({
            origin,
            projectId,
            token,
            secret,
        })),
        setEnvironments: softUpdate((state, environments) => ({
            environments,
        })),
        setEnvironment: softUpdate((state, environmentName) => ({
            environmentName,
        })),
    },
};

export default provideState(state);
