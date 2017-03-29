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

        if (response.statusCode < 200 || response.statusCode >= 300) {
            const error = new Error(`The API call returned a ${response.statusCode} HTTP error code`);
            error.code = response.statusCode;
            error.body = response.body;
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
