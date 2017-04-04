import co from 'co';

export default handler => (event, context) => {
    co(function* () {
        const body = yield handler({
            ...event,
            body: JSON.parse(event.body),
        });

        context.succeed({
            statusCode: 200,
            body: JSON.stringify(body),
        });
    })
    .catch((error) => {
        console.error('ERROR', error.message);
        console.error('ERROR STACK', error.stack);

        context.succeed({
            statusCode: error.statusCode || 500,
            body: JSON.stringify({
                message: error.toString(),
                error,
            }),
        });
    });
};
