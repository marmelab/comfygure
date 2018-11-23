import projectsQueries from '../../queries/projects';

import { NotFoundError } from '../errors';

export const getProjectOr404 = async (projectId) => {
    const project = await projectsQueries.findOne(projectId);

    if (!project) {
        throw new NotFoundError({
            message: `Unable to find project "${projectId}"`,
            details: [
                'Have you initialized a comfy project in thin directory?',
                'Type "comfy init" to do so.',
            ].join(' '),
        });
    }

    return project;
};
