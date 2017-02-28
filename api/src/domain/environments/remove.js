import environmentsQueries from '../../queries/environments';
import { LIVE, ARCHIVED } from '../common/states';

export default function* (projectId, environmentName) {
    const environment = yield environmentQueries.selectOne({
        project_id: projectId,
        name: environmentName,
        state: LIVE,
    });

    if (!environment) {
        return null;
    }

    return yield environmentsQueries.updateOne(environment.id, {
        state: ARCHIVED,
    });
}
