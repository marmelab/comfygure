import environmentsQueries from '../../queries/environments';
import { getProjectOr404 } from '../projects/get';
import { getEnvironmentOr404 } from './get';

export default async (projectId, environmentName, newEnvironmentName) => {
    await getProjectOr404(projectId);
    const environment = await getEnvironmentOr404(projectId, environmentName);

    if (!environment) {
        return null;
    }

    return environmentsQueries.updateOne(environment.id, {
        name: newEnvironmentName,
    });
};
