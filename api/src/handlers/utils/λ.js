import co from 'co';
import logger from '../../logger';
import config from '../../config';

import { convertErrorToHttpError } from './errors';

export default handler => {
    if (!!process.env.SERVERLESS) {
        return (event, context) => {
            co(function* () {
                const body = yield handler({
                    ...event,
                    body: event.body ? JSON.parse(event.body) : null
                });

                context.succeed({
                    statusCode: 200,
                    body: JSON.stringify(body)
                });
            }).catch(error => {
                logger.error('ERROR', error.message);
                logger.error('ERR. STACK', error.stack);

                const httpError = convertErrorToHttpError(error);

                context.succeed({
                    statusCode: httpError.statusCode || 500,
                    body: JSON.stringify({
                        error: config.logs.debug ? error : null,
                        message: httpError.message,
                        details: httpError.details
                    })
                });
            });
        };
    }

    return async event => handler(event);
};
