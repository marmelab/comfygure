import co from 'co';
import logger from '../../logger';

import { HttpError } from './errors';
import { NotFoundError } from '../../domain/errors';

const convertErrorToHttpError = (error) => {
    if (error instanceof HttpError) {
        return error;
    }

    if (error instanceof NotFoundError) {
        return new HttpError(404, error.message, error.details);
    }

    return new HttpError(
        500,
        CONFIG.logs.debug ? error.message : 'An error occured',
        CONFIG.logs.debug ? error.details : 'Please contact an administrator',
    );
};

export default handler => (event, context) => {
    co(function* () {
        const body = yield handler({
            ...event,
            body: event.body ? JSON.parse(event.body) : null,
        });

        context.succeed({
            statusCode: 200,
            body: JSON.stringify(body),
        });
    })
        .catch((error) => {
            logger.error('ERROR', error.message);
            logger.error('ERR. STACK', error.stack);

            const httpError = convertErrorToHttpError(error);

            context.succeed({
                statusCode: httpError.statusCode || 500,
                body: JSON.stringify({
                    error: CONFIG.logs.debug ? error : null,
                    message: httpError.message,
                    details: httpError.details,
                }),
            });
        });
};
