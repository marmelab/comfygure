import { provideState, softUpdate } from "freactal";

export const state = {
    initialState: () => ({
        token: '',
        secret: '',
    }),
    effects: {
        onTokenChange: softUpdate((state, event, token) => ({
            token,
        })),
        onSecretChange: softUpdate((state, event, secret) => ({
            secret,
        })),
    },
};

export default provideState(state);
