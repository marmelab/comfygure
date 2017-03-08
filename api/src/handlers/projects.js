import λ from './utils/λ';

import addProject from '../domain/projects/add';
import getEnviroments from '../domain/environments/get';
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

    const project = await renameProject(projectId, newProjectName);

    return project;
});

const remove = λ(async (event) => {
    const { id: projectId } = event.pathParameters;

    return removeProject(projectId);
});

export default {
    create,
    update,
    remove,
};
