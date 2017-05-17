import expect from 'expect';

import { getEnvironmentRequest } from './fetchEnvironments';

describe('getEnvironmentRequest', () => {
    it('should return request to fetchEnvironment', () => {
        const request = getEnvironmentRequest({ token: 'token', projectId: 'projectId' });
        expect(request.url).toBe('http://localhost:3000/projects/projectId/environments');
        expect(request.headers._headers).toEqual({
            accept: ['application/json'],
            authorization: ['Token token'],
            'content-type': ['application/json'],
        });
    });

    it('should throw an error if no projectId', () => {
        expect(() => getEnvironmentRequest({ token: 'token' })).toThrow(
            'Invalid projectId: expected a string but got: undefined',
        );
    });

    it('should throw an error if projectId is an object', () => {
        expect(() => getEnvironmentRequest({ projectId: { data: 'projectId' }, token: 'token' })).toThrow(
            'Invalid projectId: expected a string but got: {"data":"projectId"}',
        );
    });

    it('should throw an error if no token', () => {
        expect(() => getEnvironmentRequest({ projectId: 'projectId' })).toThrow(
            'Invalid token: expected a string but got: undefined',
        );
    });

    it('should throw an error if token is an object', () => {
        expect(() => getEnvironmentRequest({ projectId: 'projectId', token: { data: 'token' } })).toThrow(
            'Invalid token: expected a string but got: {"data":"token"}',
        );
    });
});
