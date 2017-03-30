import configurationsQueries from '../../queries/configurations';
import versionsQueries from '../../queries/versions';
import entriesQueries from '../../queries/entries';

import { get as getVersion } from './version';
import { get as getTag } from './tag';

const entriesToDictionary = entries => entries.reduce((dictionary, item) => ({
    ...dictionary,
    [item.key]: item.value,
}), {});

const findAloneConfiguration = async (projectId, environmentName) => {
    const configurations = await configurationsQueries.findAllByEnvironmentName(projectId, environmentName);

    if (configurations.length !== 1) {
        // TODO: If configurations.length = 0, return a usable error
        // TODO: If configurations.length > 1, return a usable error
        throw new Error('There is more than one configuration. Please select a configuration by its name.');
    }

    return configurations[0];
};

export default async (projectId, environmentName, selector, configName, pathTagName) => {
    let configuration;
    let tagName = pathTagName;

    if (configName && tagName) { // /configurations/{configName}/{tagName}
        configuration = await configurationsQueries.findOne(projectId, environmentName, configName);
    } else if (!selector) {  // /configurations/
        configuration = await findAloneConfiguration(projectId, environmentName);
    } else { // /configurations/{selector} where selector is a configName
        configuration = await configurationsQueries.findOne(projectId, environmentName, selector);
    }

    if (!configuration) { // /configurations/{selector} where selector is not configName
        configuration = await findAloneConfiguration(projectId, environmentName);
        tagName = pathTagName || selector;
    }

    let tag;
    if (tagName) {
        tag = await getTag(configuration.id, tagName);
    }

    if (!tag) {
        tag = await getTag(configuration.id, 'stable');
    }

    const defaultVersion = await versionsQueries.findOneByTag(configuration.id, tag.id);

    const defaultEntries = entriesToDictionary(await entriesQueries.findByVersion(defaultVersion.id));

    const version = await getVersion(projectId, environmentName, configuration.name, tag.name);

    const entries = entriesToDictionary(await entriesQueries.findByVersion(version.id));

    return {
        id: configuration.id,
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
