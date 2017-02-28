import environmentsQueries from '../../queries/environments';
import { LIVE } from '../common/states';

export default function* (projectId, environmentName, newEnvironmentName) {
    const environment = yield environmentQueries.selectOne({
        project_id: projectId,
        name: environmentName,
        state: LIVE,
    });

    if (!environment) {
        return null;
    }

    return yield environmentsQueries.updateOne(environment.id, {
        name: newEnvironmentName,
    });
}
