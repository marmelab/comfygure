import configurationsQueries from '../../queries/configurations';
import versionsQueries from '../../queries/versions';
import tagsQueries from '../../queries/tags';

export const get = function* (projectId, environmentName, configName, tagName) {
    const configuration = yield configurationsQueries.findOne(projectId, environmentName, configName);

    const tag = yield tagsQueries.findOne(configuration.id, tagName);

    let version;
    if (!tag) {
        version = yield versionsQueries.findOneByHash(configuration.id, tagName);
    } else {
        version = yield versionsQueries.findOneByTag(configuration.id, tag.id);
    }
    return {
        configuration,
        tag,
        version,
    };
};

export const getDefault = function* (projectId, configName, tagName) {
    const configuration = yield configurationsQueries.findOne(projectId, 'default', configName);

    let tag = yield tagsQueries.findOne(configuration.id, tagName);
    if (!tag) {
        tag = yield tagsQueries.findOne(configuration.id, 'stable');
    }

    const version = yield versionsQueries.findOneByTag(configuration.id, tag.id);
    return version;
};
