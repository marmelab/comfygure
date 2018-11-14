export class NotFoundError extends Error {
    constructor(args) {
        super(args);

        if (typeof args === 'string') {
            this.message = args;
        } else {
            this.message = args.message;
            this.details = args.details;
        }

        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(this.message)).stack;
        }
        this.stack = new Error().stack;
    }
}
