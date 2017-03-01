import environmentsQueries from '../../queries/environments';
import { LIVE } from '../common/states';

export default async (projectId, environmentName, newEnvironmentName) => {
    const environment = await environmentsQueries.selectOne({
        project_id: projectId,
        name: environmentName,
        state: LIVE,
    });

    if (!environment) {
        return null;
    }

    return environmentsQueries.updateOne(environment.id, {
        name: newEnvironmentName,
    });
};
