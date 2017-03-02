import environmentsQueries from '../../queries/environments';

export default async (projectId, environmentName, newEnvironmentName) => {
    console.log(1);
    const environment = await environmentsQueries.findOne(projectId, environmentName);
    console.log(2);

    if (!environment) {
        return null;
    }

    console.log(3);
    return environmentsQueries.updateOne(environment.id, {
        name: newEnvironmentName,
    });
};
