import environmentsQueries from '../../queries/environments';
import { ARCHIVED } from '../common/states';
import { getProjectOr404 } from '../projects/get';
import { getEnvironmentOr404 } from './get';

export default async (projectId, environmentName) => {
    await getProjectOr404(projectId);
    const environment = await getEnvironmentOr404(projectId, environmentName);

    if (environment.state === ARCHIVED) {
        return null;
    }

    return environmentsQueries.updateOne(environment.id, {
        state: ARCHIVED,
    });
};
