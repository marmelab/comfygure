import { checkPermission } from '../../domain/authentication';
import { HttpError } from './errors';

const parseHeader = (header) => {
    if (!header) {
        throw new HttpError('Authorization header should be set.', 403);
    }

    const [type, token] = header.split(' ');

    if (type !== 'Token' || !token) {
        throw new HttpError('Authorization header format is invalid.', 403);
    }

    return token;
};

export default async (event, projectId, level) => {
    const { headers } = event;
    const token = parseHeader(headers.Authorization);

    try {
        await checkPermission(projectId, token, level);
    } catch (e) {
        throw new HttpError(e.message, 403);
    }
};
