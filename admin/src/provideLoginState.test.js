import 'babel-polyfill';
import expect from 'expect';
import { call } from 'sg.js/dist/effects';

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

    describe('submit', () => {
        let iterator;

        beforeAll(() => {
            iterator = submit(
                {
                    setPending: 'setPending',
                    unsetPending: 'unsetPending',
                    setEnvironments: 'setEnvironments',
                    setToken: 'setToken',
                    setSecret: 'setSecret',
                    setProjectId: 'setProjectId',
                },
                {
                    projectId: 'projectId',
                    token: 'token',
                    secret: 'secret',
                },
            );
        });

        it('should call effects.setPending', () => {
            expect(iterator.next().value).toEqual(call('setPending'));
        });
    });
});
