import slug from 'slug';

import { get as getVersion } from '../configurations/version';

import tagsQueries from '../../queries/tags';
import configurationsQueries from '../../queries/configurations';

export default async (projectId, environmentName, configurationName, name, selector) => {
    if (slug(name) !== name) {
        throw new Error(`Tag name "${name}" is not valid.`);
    }

    const configuration = await configurationsQueries.findOne(projectId, environmentName, configurationName);
    if (!configuration) {
        throw new Error(`Configuration "${configurationName}" doesn't exist`);
    }

    const tag = await tagsQueries.findOne(configuration.id, name);
    if (!tag) {
        throw new Error(`Tag "${name}" doesn't exist`);
    }

    const newVersion = await getVersion(projectId, environmentName, configurationName, selector);
    if (!newVersion) {
        throw new Error(`No version found for selector "${selector}"`);
    }

    return tagsQueries.updateOne({
        configuration_id: tag.configuration_id,
        version_id: tag.version_id,
        name: tag.name,
    }, {
        version_id: newVersion.id,
    });
};
