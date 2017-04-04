import { checkPermission } from '../../domain/permissions';
import { HttpError } from './errors';

export const parseAuthorizationToken = (event) => {
    const { Authorization: authorizationHeader } = event.headers;

    if (!authorizationHeader) {
        throw new HttpError('Authorization header should be set.', 403);
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Token' || !token) {
        throw new HttpError('Authorization header format is invalid.', 403);
    }

    return token;
};

export const checkAuthorizationOr403 = async (token, projectId, level) => {
    try {
        await checkPermission(projectId, token, level);
    } catch (e) {
        throw new HttpError(e.message, 403);
    }
};
