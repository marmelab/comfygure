import entriesQueries from '../../queries/entries';
import { getDefault as getDefaultVersion, get as getVersion } from './version';

const entriesToDictionary = entries => entries.reduce((dictionary, item) => ({
    ...dictionary,
    [item.key]: item.value,
}), {});

export default async (projectId, environmentName, configName, tagName) => {
    const defaultVersion = await getDefaultVersion(projectId, configName, tagName);
    const defaultEntries = entriesToDictionary(await entriesQueries.findByVersion(defaultVersion.id));

    const { configuration, tag, version } = await getVersion(projectId, environmentName, configName, tagName);
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
