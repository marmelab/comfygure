import environmentsQueries from '../../queries/environments';

export default async (projectId, environmentName, newEnvironmentName) => {
    const environment = await environmentsQueries.findOne(projectId, environmentName);

    if (!environment) {
        return null;
    }

    return environmentsQueries.updateOne(environment.id, {
        name: newEnvironmentName,
    });
};
