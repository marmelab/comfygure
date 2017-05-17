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
        it('submit should call fetch environments and save environments and config', () => {
            const iterator = submit(
                {
                    setLoading: 'setLoading',
                    setEnvironments: 'setEnvironments',
                    setConfig: 'setConfig',
                },
                {
                    origin: 'origin',
                    projectId: 'projectId',
                    token: 'token',
                    secret: 'secret',
                },
            );
            expect(iterator.next().value).toEqual(call('setLoading', true));
            expect(iterator.next().value).toEqual(
                call(fetchEnvironments, {
                    origin: 'origin',
                    projectId: 'projectId',
                    token: 'token',
                }),
            );
            expect(iterator.next('environments').value).toEqual(call('setLoading', false));
            expect(iterator.next().value).toEqual(
                call('setConfig', {
                    origin: 'origin',
                    projectId: 'projectId',
                    token: 'token',
                    secret: 'secret',
                }),
            );
            expect(iterator.next('').value).toEqual(call('setEnvironments', 'environments'));
        });

        it('should default environments to [] if fetchEnvironments return null', () => {
            const iterator = submit(
                {
                    setEnvironments: 'setEnvironments',
                },
                {
                    origin: 'origin',
                    projectId: 'projectId',
                    token: 'token',
                },
            );
            iterator.next();
            expect(iterator.next().value).toEqual(
                call(fetchEnvironments, {
                    origin: 'origin',
                    projectId: 'projectId',
                    token: 'token',
                }),
            );

            iterator.next(null);
            iterator.next();
            expect(iterator.next().value).toEqual(call('setEnvironments', []));
        });
    });
});
