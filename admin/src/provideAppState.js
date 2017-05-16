import { provideState, softUpdate } from 'freactal';

export const state = {
    initialState: () => ({
        token: '',
        secret: '',
    }),
    effects: {
        setToken: softUpdate((state, token) => ({
            token,
        })),
        setSecret: softUpdate((state, secret) => ({
            secret,
        })),
    },
};

export default provideState(state);
