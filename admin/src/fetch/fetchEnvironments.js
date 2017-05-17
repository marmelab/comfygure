import { Request } from './fetch';
import fetchRequest from './fetchRequest';

export const getEnvironmentRequest = ({ projectId, token } = {}) => {
    if (typeof projectId !== 'string') {
        throw new Error(`Invalid projectId: expected a string but got: ${JSON.stringify(projectId)}`);
    }

    if (typeof token !== 'string') {
        throw new Error(`Invalid token: expected a string but got: ${JSON.stringify(token)}`);
    }

    return new Request(`http://localhost:3000/projects/${projectId}/environments`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
    });
};

export default fetchRequest(getEnvironmentRequest);
