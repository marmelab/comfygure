import tagsQueries from '../../queries/tags';
import configurationsQueries from '../../queries/configurations';
import validateTag from './validator';

export default async (projectId, environmentName, configurationName, name) => {
    validateTag(name);

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
