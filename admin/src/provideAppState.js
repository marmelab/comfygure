import { provideState, softUpdate } from 'freactal';

export const state = {
    initialState: () => ({
        token: '',
        secret: '',
        environments: null,
    }),
    effects: {
        setProjectId: softUpdate((state, projectId) => ({
            projectId,
        })),
        setToken: softUpdate((state, token) => ({
            token,
        })),
        setSecret: softUpdate((state, secret) => ({
            secret,
        })),
        setEnvironments: softUpdate((state, environments) => ({
            environments,
        })),
    },
};

export default provideState(state);
