import co from 'co';

import addEnvironment from '../domain/environments/add';
import getEnvironments from '../domain/environments/get';
import renameEnvironment from '../domain/environments/rename';
import removeEnvironment from '../domain/environments/remove';

const get = (event, context, callback) => {
    co(function* () {
        const { id: projectId } = event.path;

        const body = yield getEnvironments(projectId);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

const create = (event, context, callback) => {
    co(function* () {
        const { id: projectId } = event.path;
        const { name: environmentName } = event.body;

        const body = yield addEnvironment(projectId, environmentName);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

const update = (event, context, callback) => {
    co(function* () {
        const { id: projectId, environmentName } = event.path;
        const { name: newEnvironmentName } = event.body;

        const body = yield renameEnvironment(projectId, environmentName, newEnvironmentName);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

const remove = (event, context, callback) => {
    co(function* () {
        const { id: projectId, environmentName } = event.path;

        const body = yield removeEnvironment(projectId, environmentName);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

export default {
    get,
    create,
    update,
    remove,
};
