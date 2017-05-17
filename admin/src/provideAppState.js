import { provideState, softUpdate } from 'freactal';

export const state = {
    initialState: () => ({
        projectId: '',
        token: '',
        secret: '',
        environments: null,
    }),
    effects: {
        setConfig: softUpdate((state, { projectId, token, secret }) => ({
            projectId,
            token,
            secret,
        })),
        setEnvironments: softUpdate((state, environments) => ({
            environments,
        })),
    },
};

export default provideState(state);
