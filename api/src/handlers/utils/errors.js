export const AuthorizationError = (message, code = 403) => {
    const error = new Error(message);
    error.code = code;
    return error;
};
