import { provideState, softUpdate } from 'freactal';

export const state = {
    initialState: () => ({
        origin: '',
        projectId: '',
        token: '',
        secret: '',
        environments: undefined,
        environmentName: 'development',
    }),
    effects: {
        setConfig: softUpdate((state, { origin, projectId, token, secret }) => {
            sessionStorage.setItem('comfy.origin', origin);
            sessionStorage.setItem('comfy.projectId', projectId);
            sessionStorage.setItem('comfy.token', token);
            sessionStorage.setItem('comfy.secret', secret);

            return {
                origin,
                projectId,
                token,
                secret,
            };
        }),
        setEnvironments: softUpdate((state, environments) => ({
            environments,
        })),
        setEnvironment: softUpdate((state, environmentName) => ({
            environmentName,
        })),
    },
};

export default provideState(state);
