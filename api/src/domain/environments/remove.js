import environmentsQueries from '../../queries/environments';
import { LIVE, ARCHIVED } from '../common/states';

export default async (projectId, environmentName) => {
    const environment = await environmentsQueries.selectOne({
        project_id: projectId,
        name: environmentName,
        state: LIVE,
    });

    if (!environment) {
        return null;
    }

    return environmentsQueries.updateOne(environment.id, {
        state: ARCHIVED,
    });
};
