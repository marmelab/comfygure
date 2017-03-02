import environmentsQueries from '../../queries/environments';
import { LIVE } from '../common/states';

export default async (projectId, name) => {
    const environment = environmentsQueries.insertOne({
        name,
        project_id: projectId,
        state: LIVE,
    });

    // TODO: create a default configuration

    return environment;
};
