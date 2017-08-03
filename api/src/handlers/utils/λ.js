import co from 'co';
import logger from '../../logger';

export default handler => (event, context) => {
    co(function* () {
        const { body, headers } = yield handler({
            ...event,
            body: event.body ? JSON.parse(event.body) : null,
        });

        context.succeed({
            statusCode: 200,
            headers: {
                ...headers,
                'access-control-expose-headers': 'WWW-Authenticate,Server-Authorization,x-total-count',
            },
            body: JSON.stringify(body),
        });
    })
    .catch((error) => {
        logger.error('ERROR', error.message);
        logger.error('ERR. STACK', error.stack);

        context.succeed({
            statusCode: error.statusCode || 500,
            body: JSON.stringify({
                message: error.toString(),
                error,
            }),
        });
    });
};
