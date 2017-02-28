module.exports = (request) => {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    const parseResponse = callback => (error, response) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, JSON.parse(response.body));
    };

    const get = url => cb => request(url, { headers }, parseResponse(cb));

    const post = (url, body) => (cb) => {
        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        };

        return request(url, options, parseResponse(cb));
    };

    return { get, post };
};
