import co from 'co';

import addProject from '../domain/projects/add';
import getEnviroments from '../domain/environments/get';
import renameProject from '../domain/projects/rename';
import removeProject from '../domain/projects/remove';

const create = (event, context, callback) => {
    co(function* () {
        const { name: projectName, environment: environmentName } = event.body;

        const project = yield addProject(projectName, environmentName);
        const environments = yield getEnviroments(project.id);

        const response = {
            statusCode: 200,
            body: {
                ...project,
                environments: environments.map(env => env.name),
            },
        };

        callback(null, response);
    });
};

const update = (event, context, callback) => {
    co(function* () {
        const { id: projectId } = event.path;
        const { name: newProjectName } = event.body;

        const body = yield renameProject(projectId, newProjectName);

        const response = {
            statusCode: 200,
            body,
        };

        callback(null, response);
    });
};

const remove = (event, context, callback) => {
    co(function* () {
        const { id: projectId } = event.path;

        const body = yield removeProject(projectId);

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
};
