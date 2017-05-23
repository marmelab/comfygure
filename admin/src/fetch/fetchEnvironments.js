import { Request } from './fetch';
import fetchRequest from './fetchRequest';

export const getEnvironmentRequest = ({ origin, projectId, token } = {}) => {
    if (typeof projectId !== 'string') {
        throw new Error(`Invalid projectId: expected a string but got: ${JSON.stringify(projectId)}`);
    }

    if (typeof token !== 'string') {
        throw new Error(`Invalid token: expected a string but got: ${JSON.stringify(token)}`);
    }

    if (typeof origin !== 'string' || !origin.match(/^http(s)?:\/\//)) {
        throw new Error(`Invalid origin: expected an url string but got: ${JSON.stringify(origin)}`);
    }

    return new Request(`${origin}/projects/${projectId}/environments`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
    });
};

export default fetchRequest(getEnvironmentRequest);
