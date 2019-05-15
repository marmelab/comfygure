import express from 'express';
import bodyParser from 'body-parser';

import config from './config';
import logger from './logger';
import { convertErrorToHttpError } from './handlers/utils/errors';

import {
    create as createProject,
    update as updateProject,
    remove as removeProject
} from './handlers/projects';

import {
    get as getEnvironments,
    create as createEnvironment,
    update as updateEnvironment,
    remove as removeEnvironment
} from './handlers/environments';

import {
    history as getConfigurationHistory,
    get as getConfiguration,
    create as createConfiguration,
    remove as removeConfiguration
} from './handlers/configurations';

import { create as createTag, update as updateTag, remove as removeTag } from './handlers/tags';

const app = express();

const handlerToMiddleware = handler => async (req, res) => {
    const event = {
        pathParameters: req.params,
        body: req.body,
        headers: Object.assign({}, req.headers, {
            Authorization: req.headers.authorization
        })
    };

    try {
        const body = await handler(event);

        res.send(body);
    } catch (error) {
        logger.error('ERROR', error.message);
        logger.error('ERR. STACK', error.stack);

        const httpError = convertErrorToHttpError(error);

        res.status(httpError.statusCode || 500).send({
            error: config.logs.debug ? error : null,
            message: httpError.message,
            details: httpError.details
        });
    }
};

app.use(bodyParser.json());

app.post('/projects', handlerToMiddleware(createProject));
app.put('/projects/:id', handlerToMiddleware(updateProject));
app.delete('/projects/:id', handlerToMiddleware(removeProject));

app.get('/projects/:id/environments', handlerToMiddleware(getEnvironments));
app.post('/projects/:id/environments', handlerToMiddleware(createEnvironment));
app.put('/projects/:id/environments/:environmentName', handlerToMiddleware(updateEnvironment));
app.delete('/projects/:id/environments/:environmentName', handlerToMiddleware(removeEnvironment));

app.get(
    '/projects/:id/environments/:environmentName/configurations/history',
    handlerToMiddleware(getConfigurationHistory)
);
app.get(
    '/projects/:id/environments/:environmentName/configurations/:configName/history',
    handlerToMiddleware(getConfigurationHistory)
);
app.get(
    '/projects/:id/environments/:environmentName/configurations/:configName',
    handlerToMiddleware(getConfiguration)
);
app.get(
    '/projects/:id/environments/:environmentName/configurations/:configName/:tagOrHashName',
    handlerToMiddleware(getConfiguration)
);
app.post(
    '/projects/:id/environments/:environmentName/configurations/:configName/:tagName',
    handlerToMiddleware(createConfiguration)
);
app.delete(
    '/projects/:id/environments/:environmentName/configurations/:configName',
    handlerToMiddleware(removeConfiguration)
);

app.post(
    '/projects/:id/environments/:environmentName/configurations/:configName/tags',
    handlerToMiddleware(createTag)
);
app.put(
    '/projects/:id/environments/:environmentName/configurations/:configName/tags/:tagName',
    handlerToMiddleware(updateTag)
);
app.delete(
    '/projects/:id/environments/:environmentName/configurations/:configName/tags/:tagName',
    handlerToMiddleware(removeTag)
);

export default app;
