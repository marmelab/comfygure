import λ from './utils/λ';

import getConfiguration from '../domain/configurations/get';
import getHistory from '../domain/configurations/history';
import addConfiguration from '../domain/configurations/add';

const create = λ(async (event) => {
    const { id: projectId, environmentName, configName, tagName } = event.pathParameters;

    // create new configuration with entries
    return addConfiguration(projectId, environmentName, configName, tagName, event.body);
});

const update = λ(async (event) => {
    //
});

const remove = λ(async (event) => {
    // remove a configuration
});

const get = λ(async (event) => {
    const { id: projectId, environmentName, configName, tagName } = event.pathParameters;

    return getConfiguration(projectId, environmentName, configName, tagName);
});

const history = λ(async (event) => {
    const { id: projectId, environmentName, configName } = event.pathParameters;

    return getHistory(projectId, environmentName, configName);
});

export default {
    create,
    update,
    remove,
    get,
    history,
};
