import entriesQueries from '../../queries/entries';
import { getDefault as getDefaultVersion, get as getVersion } from './version';


export default function* (projectId, environmentName, configName, tagName) {
    const defaultVersion = yield getDefaultVersion(projectId, configName, tagName);
    const defaultEntries = (yield entriesQueries.findByVersion(defaultVersion.id))
        .reduce((acc, item) => ({
            ...acc,
            [item.key]: item.value,
        }), {});

    const { configuration, tag, version } = yield getVersion(projectId, environmentName, configName, tagName);
    const entries = (yield entriesQueries.findByVersion(version.id))
        .reduce((acc, item) => ({
            ...acc,
            [item.key]: item.value,
        }), {});

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
}
