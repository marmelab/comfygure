import { Request } from './fetch';
import fetchRequest from './fetchRequest';

export const updateConfigRequest = (
    { config, configName = 'default', tagName = 'stable', environmentName, origin, projectId, token } = {},
) => {
    if (typeof projectId !== 'string') {
        throw new Error(`Invalid projectId: expected a string but got: ${JSON.stringify(projectId)}`);
    }

    if (typeof token !== 'string') {
        throw new Error(`Invalid token: expected a string but got: ${JSON.stringify(token)}`);
    }

    if (typeof environmentName !== 'string') {
        throw new Error(`Invalid environmentName: expected a string but got: ${JSON.stringify(environmentName)}`);
    }

    if (typeof config !== 'object') {
        throw new Error(`Invalid config: expected an object but got: ${JSON.stringify(config)}`);
    }

    return new Request(
        `${origin}/projects/${projectId}/environments/${environmentName}/configurations/${configName}/${tagName}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(config),
        },
    );
};

export default fetchRequest(updateConfigRequest);
