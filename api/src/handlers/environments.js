import λ from './utils/λ';

import addEnvironment from '../domain/environments/add';
import getEnvironments from '../domain/environments/get';
import renameEnvironment from '../domain/environments/rename';
import removeEnvironment from '../domain/environments/remove';

const get = λ(async (event) => {
    const { id: projectId } = event.pathParameters;

    return getEnvironments(projectId);
});

const create = λ(async (event) => {
    const { id: projectId } = event.pathParameters;
    const { name: environmentName } = event.body;

    return addEnvironment(projectId, environmentName);
});

const update = λ(async (event) => {
    const { id: projectId, environmentName } = event.pathParameters;
    const { name: newEnvironmentName } = event.body;
    console.log('rename environment');
    return renameEnvironment(projectId, environmentName, newEnvironmentName);
});

const remove = λ(async (event) => {
    const { id: projectId, environmentName } = event.pathParameters;

    return removeEnvironment(projectId, environmentName);
});

export default {
    get,
    create,
    update,
    remove,
};
