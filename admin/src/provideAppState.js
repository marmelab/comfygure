import { provideState, softUpdate } from 'freactal';

export const state = {
    initialState: () => ({
        origin: '',
        projectId: '',
        token: '',
        secret: '',
        environments: undefined,
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
    },
};

export default provideState(state);
