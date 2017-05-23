export default async response => {
    if (response.status === 204) {
        return null;
    }
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    }

    return response.json().then(
        json => {
            const error = new Error(json.message);
            error.response = response;
            error.code = response.status;
            throw error;
        },
        () => {
            const error = new Error(response.statusText);
            error.response = response;
            error.code = response.status;
            throw error;
        },
    );
};
