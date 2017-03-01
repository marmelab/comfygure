import cowrap from './utils/cowrap';

import addProject from '../domain/projects/add';
import getEnviroments from '../domain/environments/get';
import renameProject from '../domain/projects/rename';
import removeProject from '../domain/projects/remove';

const create = cowrap(function* (event) {
    const { name: projectName, environment: environmentName } = event.body;

    const project = yield addProject(projectName, environmentName);
    const environments = yield getEnviroments(project.id);

    return {
        ...project,
        environments,
    };
});

const update = cowrap(function* (event) {
    const { id: projectId } = event.pathParameters;
    const { name: newProjectName } = event.body;

    const project = yield renameProject(projectId, newProjectName);

    return project;
});

const remove = cowrap(function* (event) {
    const { id: projectId } = event.pathParameters;

    return yield removeProject(projectId);
});

export default {
    create,
    update,
    remove,
};
