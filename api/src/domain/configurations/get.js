import configurationsQueries from '../../queries/configurations';
import tagsQueries from '../../queries/tags';
import versionsQueries from '../../queries/versions';
import entriesQueries from '../../queries/entries';
import { get as getVersion } from './version';

const entriesToDictionary = entries => entries.reduce((dictionary, item) => ({
    ...dictionary,
    [item.key]: item.value,
}), {});

export default async (projectId, environmentName, configurationName, tagName) => {
    const configuration = await configurationsQueries.findOne(projectId, environmentName, configurationName);

    let tag = await tagsQueries.findOne(configuration.id, tagName);
    if (!tag) {
        tag = await tagsQueries.findOne(configuration.id, 'stable');
    }
    const defaultVersion = await versionsQueries.findOneByTag(configuration.id, tag.id);

    const defaultEntries = entriesToDictionary(await entriesQueries.findByVersion(defaultVersion.id));

    const version = await getVersion(projectId, environmentName, configurationName, tagName);
    const entries = entriesToDictionary(await entriesQueries.findByVersion(version.id));

    return {
        name: configuration.name,
        tag: tag ? tag.name : '',
        hash: version.hash,
        previous: version.previous,
        defaultFormat: configuration.defaultFormat,
        body: {
            ...defaultEntries,
            ...entries,
        },
        state: configuration.state,
    };
};
