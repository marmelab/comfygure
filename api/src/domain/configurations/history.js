import getConfiguration from './get';
import versionsQueries from '../../queries/versions';

export default async (projectId, environmentName, configName, all = false) => {
    const configuration = await getConfiguration(projectId, environmentName, configName);

    const versions = await versionsQueries.find(configuration.id);

    return versions
        .filter(version => (all ? true : version.tags.length)) // TODO: Do this filter in SQL
        .sort((a, b) => b.created_at - a.created_at)
        .map(version => ({
            name: configuration.name,
            hash: version.hash,
            previous: version.previous,
            tags: version.tags,
            defaultFormat: configuration.default_format,
            created_at: version.created_at
        }));
};
