import { Request } from './fetch';
import fetchRequest from './fetchRequest';

export const getEnvironmentRequest = ({ projectId, token }) =>
    new Request(`http://localhost:3000/projects/${projectId}/environments`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
    });

export default fetchRequest(getEnvironmentRequest);
