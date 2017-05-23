import 'babel-polyfill';
import expect from 'expect';

import handleFetchResponse from './handleFetchResponse';

describe('handleFetchResponse', () => {
    it('should resolve to null if response.status is 204', async () => {
        expect(await handleFetchResponse({ status: 204 })).toBe(null);
    });

    it('should resolve to response.json() if response.status is 200', async () => {
        expect(
            await handleFetchResponse({
                status: 200,
                json: () => Promise.resolve('response json'),
            }),
        ).toBe('response json');
    });

    it('should reject to response.json() if response.status is 500', async () => {
        const response = {
            status: 500,
            json: () => Promise.resolve({ message: 'error message' }),
        };

        const error = await handleFetchResponse(response).catch(e => e);

        expect(error.response).toEqual(response);
        expect(error.code).toEqual(500);
        expect(error.message).toEqual('error message');
    });

    it('should reject to response.statusText if response.json fail when status is 500', async () => {
        const response = {
            status: 500,
            statusText: 'error message',
            json: () => Promise.reject(),
        };

        const error = await handleFetchResponse(response).catch(e => e);

        expect(error.response).toEqual(response);
        expect(error.code).toEqual(500);
        expect(error.message).toEqual('error message');
    });
});
