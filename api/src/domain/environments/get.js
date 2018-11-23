import environmentsQueries from '../../queries/environments';
import { NotFoundError } from '../errors';

export const getEnvironmentOr404 = async (projectId, environmentName) => {
    const env = await environmentsQueries.findOne(projectId, environmentName);

    if (!env) {
        throw new NotFoundError({
            message: `Unable to find environment "${environmentName}" for project "${projectId}".`,
            details: 'Type "comfy env ls" to list available environments.',
        });
    }

    return env;
};

export default async projectId => environmentsQueries.selectByProject(projectId);
