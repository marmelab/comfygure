import λ from './utils/λ';
import { checkAuthorizationOr403, parseAuthorizationToken } from './utils/authorization';

import addEnvironment from '../domain/environments/add';
import getEnvironments from '../domain/environments/get';
import renameEnvironment from '../domain/environments/rename';
import removeEnvironment from '../domain/environments/remove';

const get = λ(async (event) => {
    const { id: projectId } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'read');

    return getEnvironments(projectId);
});

const create = λ(async (event) => {
    const { id: projectId } = event.pathParameters;
    const { name: environmentName } = event.body;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    return addEnvironment(projectId, environmentName);
});

const update = λ(async (event) => {
    const { id: projectId, environmentName } = event.pathParameters;
    const { name: newEnvironmentName } = event.body;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    return renameEnvironment(projectId, environmentName, newEnvironmentName);
});

const remove = λ(async (event) => {
    const { id: projectId, environmentName } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');
    return removeEnvironment(projectId, environmentName);
});

export default {
    get,
    create,
    update,
    remove,
};
