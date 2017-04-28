import λ from './utils/λ';
import { checkAuthorizationOr403, parseAuthorizationToken } from './utils/authorization';

import getConfiguration from '../domain/configurations/get';
import getHistory from '../domain/configurations/history';
import addConfiguration from '../domain/configurations/add';

const create = λ(async (event) => {
    const { id: projectId, environmentName, configName, tagName } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    // create new configuration with entries
    return {
        body: await addConfiguration(projectId, environmentName, configName, tagName, event.body),
    };
});

const update = λ(async (event) => {
    //
});

const remove = λ(async (event) => {
    // remove a configuration
});

const get = λ(async (event) => {
    const { id: projectId, environmentName, configName: selector, tagName } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'read');

    return {
        body: await getConfiguration(projectId, environmentName, selector, tagName),
    };
});

const history = λ(async (event) => {
    const { id: projectId, environmentName, configName } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'read');
    const all = event.queryStringParameters && Object.keys(event.queryStringParameters).includes('all');

    const allConfigurations = await getHistory(projectId, environmentName, configName, all);

    return {
        headers: {
            'X-Total-Count': allConfigurations.length,
        },
        body: allConfigurations,
    };
});

export default {
    create,
    update,
    remove,
    get,
    history,
};
