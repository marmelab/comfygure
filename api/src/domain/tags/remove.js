import slug from 'slug';

import tagsQueries from '../../queries/tags';
import configurationsQueries from '../../queries/configurations';

export default async (projectId, environmentName, configurationName, name) => {
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

    return tagsQueries.removeOne(tag);
};
