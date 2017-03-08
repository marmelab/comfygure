import environmentsQueries from '../../queries/environments';
import { ARCHIVED } from '../common/states';

export default async (projectId, environmentName) => {
    const environment = await environmentsQueries.findOne(projectId, environmentName);

    if (!environment || environment.state === ARCHIVED) {
        return null;
    }

    return environmentsQueries.updateOne(environment.id, {
        state: ARCHIVED,
    });
};
