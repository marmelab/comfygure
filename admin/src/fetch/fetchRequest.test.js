import 'babel-polyfill';
import expect, { createSpy } from 'expect';

import { fetchRequestFactory } from './fetchRequest';

describe('fetchRequest', () => {
    it('should call getRequest with args and pipe the to fetchImpl then handleFetchResponseImpl', async () => {
        const fetchImpl = createSpy().andReturn('fetch response');
        const handleFetchResponseImpl = createSpy().andReturn('parsed response');
        const getRequest = createSpy().andReturn('request');
        const fetchRequest = fetchRequestFactory({ fetchImpl, handleFetchResponseImpl });
        expect(await fetchRequest(getRequest)('args')).toBe('parsed response');

        expect(getRequest).toHaveBeenCalledWith('args');
        expect(fetchImpl).toHaveBeenCalledWith('request');
        expect(handleFetchResponseImpl).toHaveBeenCalledWith('fetch response');
    });

    it('should reject with getRequest error not calling fetchImpl nor handleFetchResponseImpl', async () => {
        const fetchImpl = createSpy().andReturn('fetch response');
        const handleFetchResponseImpl = createSpy().andReturn('parsed response');
        const getRequest = createSpy().andThrow(new Error('bad request'));
        const fetchRequest = fetchRequestFactory({ fetchImpl, handleFetchResponseImpl });
        const error = await fetchRequest(getRequest)('args').catch(e => e);

        expect(error.message).toBe('bad request');

        expect(getRequest).toHaveBeenCalledWith('args');
        expect(fetchImpl).toNotHaveBeenCalled();
        expect(handleFetchResponseImpl).toNotHaveBeenCalled();
    });

    it('should reject with fetchImpl error not calling handleFetchResponseImpl', async () => {
        const fetchImpl = createSpy().andReturn(Promise.reject(new Error('fetch error')));
        const handleFetchResponseImpl = createSpy().andReturn('parsed response');
        const getRequest = createSpy().andReturn('request');
        const fetchRequest = fetchRequestFactory({ fetchImpl, handleFetchResponseImpl });
        const error = await fetchRequest(getRequest)('args').catch(e => e);

        expect(error.message).toBe('fetch error');

        expect(getRequest).toHaveBeenCalledWith('args');
        expect(fetchImpl).toHaveBeenCalledWith('request');
        expect(handleFetchResponseImpl).toNotHaveBeenCalled();
    });

    it('should reject with handleFetchResponseImpl error', async () => {
        const fetchImpl = createSpy().andReturn('fetch response');
        const handleFetchResponseImpl = createSpy().andReturn(Promise.reject(new Error('fetch response error')));
        const getRequest = createSpy().andReturn('request');
        const fetchRequest = fetchRequestFactory({ fetchImpl, handleFetchResponseImpl });
        const error = await fetchRequest(getRequest)('args').catch(e => e);

        expect(error.message).toBe('fetch response error');

        expect(getRequest).toHaveBeenCalledWith('args');
        expect(fetchImpl).toHaveBeenCalledWith('request');
        expect(handleFetchResponseImpl).toHaveBeenCalledWith('fetch response');
    });
});
