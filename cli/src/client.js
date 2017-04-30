module.exports = (request) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    const parseResponse = callback => (err, response) => {
        if (err) {
            callback(err);
            return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
            const error = new Error(`The API call returned a ${response.statusCode} HTTP error code`);
            error.code = response.statusCode;
            error.body = response.body && JSON.parse(response.body);
            callback(error);
            return;
        }

        callback(null, JSON.parse(response.body));
    };

    const get = (url, headers = {}) => cb => request(
        url,
        { headers: Object.assign({}, defaultHeaders, headers) },
        parseResponse(cb)
    );

    const post = (url, body, headers = {}) => (cb) => {
        const options = {
            method: 'POST',
            headers: Object.assign({}, defaultHeaders, headers),
            body: JSON.stringify(body),
        };

        return request(url, options, parseResponse(cb));
    };

    const put = (url, body, headers = {}) => (cb) => {
        const options = {
            method: 'PUT',
            headers: Object.assign({}, defaultHeaders, headers),
            body: JSON.stringify(body),
        };

        return request(url, options, parseResponse(cb));
    };

    const buildAuthorization = project => ({ Authorization: `Token ${project.secretToken}` });

    return { get, post, put, buildAuthorization };
};
