import λ from './utils/λ';
import { checkAuthorizationOr403, parseAuthorizationToken } from './utils/authorization';

import addTag from '../domain/tags/add';
import moveTag from '../domain/tags/move';
import removeTag from '../domain/tags/remove';

export const create = λ(async (event) => {
    const { id: projectId, environmentName, configName } = event.pathParameters;
    const { selector, name } = event.body;

    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    const tag = await addTag(projectId, environmentName, configName, selector, name);

    return tag;
});

export const update = λ(async (event) => {
    const {
        id: projectId, environmentName, configName, tagName,
    } = event.pathParameters;
    const { selector } = event.body;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    const project = await moveTag(projectId, environmentName, configName, tagName, selector);

    return project;
});

export const remove = λ(async (event) => {
    const {
        id: projectId, environmentName, configName, tagName,
    } = event.pathParameters;
    await checkAuthorizationOr403(parseAuthorizationToken(event), projectId, 'write');

    return removeTag(projectId, environmentName, configName, tagName);
});
