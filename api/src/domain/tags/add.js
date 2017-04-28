import slug from 'slug';

import { get as getVersion } from '../configurations/version';
import tagsQueries from '../../queries/tags';

export default async (projectId, environmentName, configName, selector, name) => {
    if (slug(name) !== name) {
        throw new Error(`Tag name "${name}" is not valid.`);
    }

    const version = await getVersion(projectId, environmentName, configName, selector);
    if (!version) {
        throw new Error(`No version found for selector "${selector}"`);
    }

    return tagsQueries.insertOne({
        configuration_id: version.configuration_id,
        version_id: version.id,
        name,
    });
};
