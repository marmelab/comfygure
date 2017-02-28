import environmentsQueries from '../../queries/environments';
import { LIVE } from '../common/states';

export default function* (projectId, name) {
    return yield environmentsQueries.insertOne({
        name,
        project_id: projectId,
        state: LIVE,
    });
}
