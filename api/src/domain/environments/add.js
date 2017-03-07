import environmentsQueries from '../../queries/environments';
import addConfiguration from '../configurations/add';
import { LIVE } from '../common/states';

export default async (projectId, environmentName = 'default', configurationName = 'default') => {
    const environment = await environmentsQueries.insertOne({
        name: environmentName,
        project_id: projectId,
        state: LIVE,
    });

    const configuration = await addConfiguration(projectId, environmentName, configurationName);

    return {
        ...environment,
        configurations: [configuration],
    };
};
