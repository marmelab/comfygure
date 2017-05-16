import { provideState, softUpdate } from "freactal";

export const submit = effects => state => effects.setToken(state.token)
    .then(effects.setSecret(state.secret));

export const state = {
    initialState: () => ({
        token: '',
        secret: '',
    }),
    effects: {
        onTokenChange: softUpdate((state, event, token) => ({ token })),
        onSecretChange: softUpdate((state, event, secret) => ({ secret })),
        submit,
    },
};

export default provideState(state);
