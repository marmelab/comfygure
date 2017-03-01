import environmentsQueries from '../../queries/environments';
import { LIVE } from '../common/states';

export default async (projectId, name) =>
    environmentsQueries.insertOne({
        name,
        project_id: projectId,
        state: LIVE,
    });
