import tagsQueries from '../../queries/tags';

export const add = async (configurationId, versionId, name) => tagsQueries.insertOne({
    configuration_id: configurationId,
    version_id: versionId,
    name, // TODO: slufigy the tag name or throw if the format is invalid
});

export const get = async (configurationId, name) => tagsQueries.findOne(configurationId, name);

export const update = async (tag, attributes) => tagsQueries.updateOne(tag, attributes);
