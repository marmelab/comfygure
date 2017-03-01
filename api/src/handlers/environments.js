import cowrap from './utils/cowrap';

import addEnvironment from '../domain/environments/add';
import getEnvironments from '../domain/environments/get';
import renameEnvironment from '../domain/environments/rename';
import removeEnvironment from '../domain/environments/remove';

const get = cowrap(function* (event) {
    const { id: projectId } = event.pathParameters;

    return yield getEnvironments(projectId);
});

const create = cowrap(function* (event) {
    const { id: projectId } = event.pathParameters;
    const { name: environmentName } = event.body;

    return yield addEnvironment(projectId, environmentName);
});

const update = cowrap(function* (event) {
    const { id: projectId, environmentName } = event.pathParameters;
    const { name: newEnvironmentName } = event.body;

    return yield renameEnvironment(projectId, environmentName, newEnvironmentName);
});

const remove = cowrap(function* (event) {
    const { id: projectId, environmentName } = event.pathParameters;

    return yield removeEnvironment(projectId, environmentName);
});

export default {
    get,
    create,
    update,
    remove,
};
