import configurationsQueries from "../../queries/configurations";
import versionsQueries from "../../queries/versions";
import tagsQueries from "../../queries/tags";

export const get = async (projectId, environmentName, configName, selector) => {
  const configuration = await configurationsQueries.findOne(
    projectId,
    environmentName,
    configName
  );
  const tag = await tagsQueries.findOne(configuration.id, selector);

  let version;
  if (!tag) {
    version = await versionsQueries.findOneByHash(configuration.id, selector);
  } else {
    version = await versionsQueries.findOne(tag.version_id);
  }

  return version;
};

export const getDefault = async (projectId, configName, tagName) => {
  const configuration = await configurationsQueries.findOne(
    projectId,
    "default",
    configName
  );

  let tag = await tagsQueries.findOne(configuration.id, tagName);
  if (!tag) {
    tag = await tagsQueries.findOne(configuration.id, "latest");
  }

  const version = await versionsQueries.findOneByTag(configuration.id, tag.id);
  return version;
};
