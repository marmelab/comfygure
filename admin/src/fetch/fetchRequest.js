import fetch from './fetch';
import handleFetchResponse from './handleFetchResponse';

import pipeAsync from '../utils/pipeAsync';

export const fetchRequestFactory = ({ fetchImpl, handleFetchResponseImpl }) => getRequest => (...args) =>
    pipeAsync(getRequest, fetchImpl, handleFetchResponseImpl)(...args);

export default fetchRequestFactory({
    fetchImpl: fetch,
    handleFetchResponseImpl: handleFetchResponse,
});
