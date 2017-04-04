import λ from './utils/λ';
import { checkAuthorizationOr403, parseAuthorizationToken } from './utils/authorization';

import addProject from '../domain/projects/add';
import renameProject from '../domain/projects/rename';
import removeProject from '../domain/projects/remove';

const create = λ(async (event) => {
    const { name: projectName, environment: environmentName } = event.body;

    const project = await addProject(projectName, environmentName);

    return project;
});

const update = λ(async (event) => {
    const { id: projectId } = event.pathParameters;
    const { name: newProjectName } = event.body;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    const project = await renameProject(projectId, newProjectName);

    return project;
});

const remove = λ(async (event) => {
    const { id: projectId } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    return removeProject(projectId);
});

export default {
    create,
    update,
    remove,
};
