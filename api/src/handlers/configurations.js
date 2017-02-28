import co from 'co';

import {
    get as getConfiguration,
    history as getHistory,
    add as addConfiguration,
} from '../domain/configurations';

const create = (event, context, callback) => {
    co(function* () {
        const { id: projectId, environmentName, configName, tagName } = event.path;

        const body = yield addConfiguration(projectId, environmentName, configName, tagName);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

const update = (event, context, callback) => {

};

const remove = (event, context, callback) => {

};

const get = (event, context, callback) => {
    co(function* () {
        const { id: projectId, environmentName, configName, tagName } = event.path;

        const body = yield getConfiguration(projectId, environmentName, configName, tagName);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

const history = (event, context, callback) => {
    co(function* () {
        const { id: projectId, environmentName, configName } = event.path;

        const body = yield getHistory(projectId, environmentName, configName);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

export default {
    create,
    update,
    remove,
    get,
    history,
};
