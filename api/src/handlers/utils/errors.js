export class HttpError extends Error {
    constructor(statusCode = 500, message = 'An error occured', details = null) {
        super(message);
        this.message = message;
        this.details = details;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
        this.stack = new Error().stack;
    }
}
