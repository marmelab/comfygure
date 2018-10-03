export class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
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
