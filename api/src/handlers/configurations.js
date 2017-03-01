import cowrap from './utils/cowrap';

import getConfiguration from '../domain/configurations/get';
import getHistory from '../domain/configurations/history';
import addConfiguration from '../domain/configurations/add';

const create = cowrap(function* (event) {
    const { id: projectId, environmentName, configName, tagName } = event.pathParameters;

    return yield addConfiguration(projectId, environmentName, configName, tagName);
});

const update = cowrap(function* (event) {

});

const remove = cowrap(function* (event) {

});

const get = cowrap(function* (event) {
    const { id: projectId, environmentName, configName, tagName } = event.pathParameters;

    return yield getConfiguration(projectId, environmentName, configName, tagName);
});

const history = cowrap(function* (event) {
    const { id: projectId, environmentName, configName } = event.pathParameters;

    return yield getHistory(projectId, environmentName, configName);
});

export default {
    create,
    update,
    remove,
    get,
    history,
};
