import { getProjectOr404 } from './projects/get';
import { getEnvironmentOr404 } from './environments/get';

export const checkEnvironmentExistsOrThrow404 = async (projectId, environmentName) => {
    await getProjectOr404(projectId);
    await getEnvironmentOr404(projectId, environmentName);
};
