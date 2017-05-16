import expect from 'expect';

import provideAppState from './provideAppState';

describe('provideAppState', () => {
    it('should update token', () => {
        const { effects, getState } = new (provideAppState())(null, {});
        expect(getState().token).toBe('');
        expect(getState().secret).toBe('');

        return Promise.resolve()
            .then(() => effects.setToken('token'))
            .then(() => expect(getState().token).toBe('token'));
    });

    it('should update secret', () => {
        const { effects, getState } = new (provideAppState())(null, {});
        expect(getState().token).toBe('');
        expect(getState().secret).toBe('');

        return Promise.resolve()
            .then(() => effects.setSecret('secret'))
            .then(() => expect(getState().secret).toBe('secret'));
    });
});
