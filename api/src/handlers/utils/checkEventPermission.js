import { checkPermission } from '../../domain/authentication';
import { AuthorizationError } from './errors';

const parseHeader = (header) => {
    if (!header) {
        throw AuthorizationError('Authorization header should be set.');
    }

    const [type, token] = header.split(' ');

    if (type !== 'Token' || !token) {
        throw AuthorizationError('Authorization header format is invalid.');
    }

    return token;
};

export default async (event, projectId, level) => {
    const { headers } = event;
    const token = parseHeader(headers.Authorization);

    try {
        await checkPermission(projectId, token, level);
    } catch (e) {
        throw AuthorizationError(e.message);
    }
};
