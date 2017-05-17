import 'babel-polyfill';
import expect from 'expect';
import { call } from 'sg.js/dist/effects';

import provideLoginState, { submit } from './provideLoginState';
import fetchEnvironments from './fetch/fetchEnvironments';

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
        it('should call fetch environments and save environments and config', () => {
            const iterator = submit(
                {
                    setPending: 'setPending',
                    unsetPending: 'unsetPending',
                    setEnvironments: 'setEnvironments',
                    setConfig: 'setConfig',
                },
                {
                    projectId: 'projectId',
                    token: 'token',
                    secret: 'secret',
                },
            );
            expect(iterator.next().value).toEqual(call('setPending'));
            expect(iterator.next().value).toEqual(
                call(fetchEnvironments, {
                    projectId: 'projectId',
                    token: 'token',
                }),
            );
            expect(iterator.next('environments').value).toEqual(call('unsetPending'));
            expect(iterator.next().value).toEqual(
                call('setConfig', {
                    projectId: 'projectId',
                    token: 'token',
                    secret: 'secret',
                }),
            );
            expect(iterator.next('').value).toEqual(call('setEnvironments', 'environments'));
        });

        it('should set Error if fetchEnvironments fail', () => {
            const iterator = submit(
                {
                    setPending: 'setPending',
                    unsetPending: 'unsetPending',
                    setError: 'setError',
                },
                {
                    projectId: 'projectId',
                    token: 'token',
                    secret: 'secret',
                },
            );
            expect(iterator.next().value).toEqual(call('setPending'));
            expect(iterator.next().value).toEqual(
                call(fetchEnvironments, {
                    projectId: 'projectId',
                    token: 'token',
                }),
            );
            expect(iterator.throw(new Error('fetch error')).value).toEqual(call('unsetPending'));
            expect(iterator.next().value).toEqual(call('setError', 'fetch error'));
        });
    });
});
