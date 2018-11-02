import λ from './utils/λ';
import { checkAuthorizationOr403, parseAuthorizationToken } from './utils/authorization';

import getConfiguration from '../domain/configurations/get';
import getHistory from '../domain/configurations/history';
import addConfiguration from '../domain/configurations/add';

export const create = λ(async (event) => {
    const {
        id: projectId, environmentName, configName, tagName,
    } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    // create new configuration with entries
    return addConfiguration(projectId, environmentName, configName, tagName, event.body);
});

export const update = λ(async () => {
    //
});

export const remove = λ(async () => {
    // remove a configuration
});

export const get = λ(async (event) => {
    const {
        id: projectId, environmentName, configName: selector, tagName,
    } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'read');

    return getConfiguration(projectId, environmentName, selector, tagName);
});

export const history = λ(async (event) => {
    const { id: projectId, environmentName, configName } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'read');
    const all = event.queryStringParameters && Object.keys(event.queryStringParameters).includes('all');

    return getHistory(projectId, environmentName, configName, all);
});
