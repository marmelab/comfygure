import configurationsQueries from '../../queries/configurations';
import versionsQueries from '../../queries/versions';

export default function* (projectId, environmentName, configName) {
    const configuration = yield configurationsQueries.findOne(projectId, environmentName, configName);

    const versions = yield versionsQueries.find(configuration.id);

    return versions.map(version => ({
        name: configuration.name,
        hash: version.hash,
        previous: version.previous,
        tag: version.tag,
        defaultFormat: configuration.defaultFormat,
    }));
}
