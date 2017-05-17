import expect from 'expect';

import provideAppState from './provideAppState';

describe('provideAppState', () => {
    describe('setConfig', () => {
        it('should update token, secret and projectId', () => {
            const { effects, getState } = new (provideAppState())(null, {});
            expect(getState().token).toBe('');
            expect(getState().secret).toBe('');
            expect(getState().projectId).toBe('');

            return Promise.resolve()
                .then(() => effects.setConfig({ token: 'token', projectId: 'projectId', secret: 'secret' }))
                .then(() => expect(getState().token).toBe('token'))
                .then(() => expect(getState().secret).toBe('secret'))
                .then(() => expect(getState().projectId).toBe('projectId'));
        });
    });
});
