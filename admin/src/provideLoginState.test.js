import expect, { createSpy } from 'expect';

import provideLoginState, { submit } from './provideLoginState';

describe('provideLoginState', () => {
    it('should update token', () => {
        const { effects, getState } = new (provideLoginState())(null, {});
        expect(getState().token).toBe('');
        expect(getState().secret).toBe('');

        return Promise.resolve()
            .then(() => effects.onTokenChange(null, 'token'))
            .then(() => expect(getState().token).toBe('token'));
    });

    it('should update secret', () => {
        const { effects, getState } = new (provideLoginState())(null, {});
        expect(getState().token).toBe('');
        expect(getState().secret).toBe('');

        return Promise.resolve()
            .then(() => effects.onSecretChange(null, 'secret'))
            .then(() => expect(getState().secret).toBe('secret'));
    });

    it('should trigger setLogin and setToken with submit', async () => {
        const setToken = createSpy().andReturn(Promise.resolve());
        const setSecret = createSpy().andReturn(Promise.resolve());
        await submit({ setToken, setSecret })({ token: 'token', secret: 'secret' });
        expect(setToken).toHaveBeenCalledWith('token');
        expect(setSecret).toHaveBeenCalledWith('secret');
    });
});
