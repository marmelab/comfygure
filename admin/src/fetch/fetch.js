import fetchPonyfill from 'fetch-ponyfill';

const { fetch, Request: req } = fetchPonyfill();

export const Request = req;

export default fetch;
