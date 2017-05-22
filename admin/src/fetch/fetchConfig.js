import { Request } from './fetch';
import fetchRequest from './fetchRequest';

export const getConfigRequest = ({ origin, projectId, environmentName, configName = 'default', token } = {}) => {
    if (typeof projectId !== 'string') {
        throw new Error(`Invalid projectId: expected a string but got: ${JSON.stringify(projectId)}`);
    }

    if (typeof token !== 'string') {
        throw new Error(`Invalid token: expected a string but got: ${JSON.stringify(token)}`);
    }

    if (typeof environmentName !== 'string') {
        throw new Error(`Invalid environmentName: expected a string but got: ${JSON.stringify(environmentName)}`);
    }

    if (typeof configName !== 'string') {
        throw new Error(`Invalid configName: expected a string but got: ${JSON.stringify(configName)}`);
    }

    return new Request(`${origin}/projects/${projectId}/environments/${environmentName}/configurations/${configName}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
    });
};

export default fetchRequest(getConfigRequest);
