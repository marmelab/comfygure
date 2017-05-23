import expect, { createSpy } from 'expect';

import provideAppState from './provideAppState';

describe('provideAppState', () => {
    describe('setConfig', () => {
        global.sessionStorage = {
            setItem: createSpy(),
        };

        it('should update token, passphrase and projectId', () => {
            const { effects, getState } = new (provideAppState())({}, {});
            expect(getState().origin).toBe('');
            expect(getState().token).toBe('');
            expect(getState().passphrase).toBe('');
            expect(getState().projectId).toBe('');

            return Promise.resolve()
                .then(() =>
                    effects.setConfig({
                        origin: 'origin',
                        token: 'token',
                        projectId: 'projectId',
                        passphrase: 'passphrase',
                    }),
                )
                .then(() => expect(getState().origin).toBe('origin'))
                .then(() => expect(getState().token).toBe('token'))
                .then(() => expect(getState().passphrase).toBe('passphrase'))
                .then(() => expect(getState().projectId).toBe('projectId'));
        });
    });
});
