import λ from './utils/λ';

import getConfiguration from '../domain/configurations/get';
import getHistory from '../domain/configurations/history';
import addConfiguration from '../domain/configurations/add';

const create = λ(async (event, client) => {
    const { id: projectId, environmentName, configName, tagName } = event.pathParameters;

    return addConfiguration(client)(projectId, environmentName, configName, tagName);
});

const update = λ(async (event) => {

});

const remove = λ(async (event) => {

});

const get = λ(async (event, client) => {
    const { id: projectId, environmentName, configName, tagName } = event.pathParameters;

    return getConfiguration(client)(projectId, environmentName, configName, tagName);
});

const history = λ(async (event, client) => {
    const { id: projectId, environmentName, configName } = event.pathParameters;

    return getHistory(client)(projectId, environmentName, configName);
});

export default {
    create,
    update,
    remove,
    get,
    history,
};
