import 'babel-polyfill';
import expect from 'expect';

import { getEnvironmentRequest } from './fetchEnvironments';

describe('getEnvironmentRequest', () => {
    it('should return request to fetchEnvironment', () => {
        const request = getEnvironmentRequest({
            origin: 'http://localhost:3000',
            token: 'token',
            projectId: 'projectId',
        });
        expect(request.url).toBe('http://localhost:3000/projects/projectId/environments');
        expect(request.headers._headers).toEqual({
            accept: ['application/json'],
            authorization: ['Token token'],
            'content-type': ['application/json'],
        });
    });

    it('should throw an error if no origin', () => {
        expect(() =>
            getEnvironmentRequest({
                token: 'token',
                projectId: 'projectId',
            }),
        ).toThrow('Invalid origin: expected an url string but got: undefined');
    });

    it('should throw an error if projectId is an object', () => {
        expect(() =>
            getEnvironmentRequest({
                origin: { data: 'http://localhost:3000' },
                projectId: 'projectId',
                token: 'token',
            }),
        ).toThrow('Invalid origin: expected an url string but got: {"data":"http://localhost:3000"}');
    });

    it('should throw an error if projectId do not start by http', () => {
        expect(() =>
            getEnvironmentRequest({
                origin: { data: 'localhost:3000' },
                projectId: 'projectId',
                token: 'token',
            }),
        ).toThrow('Invalid origin: expected an url string but got: {"data":"localhost:3000"}');
    });

    it('should throw an error if no projectId', () => {
        expect(() =>
            getEnvironmentRequest({
                origin: 'http://localhost:3000',
                token: 'token',
            }),
        ).toThrow('Invalid projectId: expected a string but got: undefined');
    });

    it('should throw an error if projectId is an object', () => {
        expect(() =>
            getEnvironmentRequest({
                origin: 'http://localhost:3000',
                projectId: { data: 'projectId' },
                token: 'token',
            }),
        ).toThrow('Invalid projectId: expected a string but got: {"data":"projectId"}');
    });

    it('should throw an error if no token', () => {
        expect(() =>
            getEnvironmentRequest({
                origin: 'http://localhost:3000',
                projectId: 'projectId',
            }),
        ).toThrow('Invalid token: expected a string but got: undefined');
    });

    it('should throw an error if token is an object', () => {
        expect(() =>
            getEnvironmentRequest({
                origin: 'http://localhost:3000',
                projectId: 'projectId',
                token: {
                    data: 'token',
                },
            }),
        ).toThrow('Invalid token: expected a string but got: {"data":"token"}');
    });
});
