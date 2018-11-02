import environmentsQueries from '../queries/environments';
import projectsQueries from '../queries/projects';

import { NotFoundError } from './errors';

export const checkEnvironmentExistsOrThrow404 = async (projectId, environmentName) => {
    const project = await projectsQueries.findOne(projectId);

    if (!project) {
        throw new NotFoundError({
            message: `Unable to found project "${projectId}"`,
            details: [
                'Have you initialized a comfy project is this directory?',
                'Type "comfy init" to do so.',
            ].join(' '),
        });
    }

    const env = await environmentsQueries.findOne(projectId, environmentName);

    if (!env) {
        throw new NotFoundError({
            message: `Unable to found environment "${environmentName}" for project "${projectId}".`,
            details: 'Type "comfy env ls" to list available environments.',
        });
    }
};
