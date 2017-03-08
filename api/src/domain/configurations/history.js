import configurationsQueries from '../../queries/configurations';
import versionsQueries from '../../queries/versions';

export default async (projectId, environmentName, configName) => {
    const configuration = await configurationsQueries.findOne(projectId, environmentName, configName);

    const versions = await versionsQueries.find(configuration.id);

    return versions.map(version => ({
        name: configuration.name,
        hash: version.hash,
        previous: version.previous,
        tag: version.tag,
        defaultFormat: configuration.defaultFormat,
    }));
};
