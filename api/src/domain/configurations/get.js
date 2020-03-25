import configurationsQueries from "../../queries/configurations";
import entriesQueries from "../../queries/entries";
import { NotFoundError } from "../../domain/errors";

import { get as getVersion } from "./version";
import { get as getTag } from "./tag";

import { checkEnvironmentExistsOrThrow404 } from "../validation";

const entriesToDictionary = (entries) =>
  entries.reduce(
    (dictionary, item) => ({
      ...dictionary,
      [item.key]: item.value,
    }),
    {}
  );

const findAloneConfiguration = async (projectId, environmentName) => {
  const configurations = await configurationsQueries.findAllByEnvironmentName(
    projectId,
    environmentName
  );

  if (configurations.length !== 1) {
    // TODO: If configurations.length = 0, return a usable error
    // TODO: If configurations.length > 1, return a usable error
    throw new Error(
      "There is more than one configuration. Please select a configuration by its name."
    );
  }

  return configurations[0];
};

export default async (
  projectId,
  environmentName,
  selector,
  pathTagOrHashName
) => {
  // The `selector` argument can be a configName, a tag, or empty
  // TODO (Kevin): If needed, move this selector intelligence into its own service

  let configuration;
  let tagOrHashName = pathTagOrHashName;

  await checkEnvironmentExistsOrThrow404(projectId, environmentName);

  if (selector && tagOrHashName) {
    configuration = await configurationsQueries.findOne(
      projectId,
      environmentName,
      selector
    );
  } else if (!selector) {
    configuration = await findAloneConfiguration(projectId, environmentName);
  } else {
    configuration = await configurationsQueries.findOne(
      projectId,
      environmentName,
      selector
    );
  }

  if (!configuration) {
    configuration = await findAloneConfiguration(projectId, environmentName);
    tagOrHashName = pathTagOrHashName || selector;
  }

  let tag;
  let version;
  const defaultTag = "latest";
  if (tagOrHashName) {
    version = await getVersion(
      projectId,
      environmentName,
      configuration.name,
      tagOrHashName
    );
  } else {
    tag = await getTag(configuration.id, defaultTag);
    version = await getVersion(
      projectId,
      environmentName,
      configuration.name,
      tag ? tag.name : ""
    );
  }

  if (!version) {
    throw new NotFoundError(
      `There is no tag or hash with this name: ${
        tagOrHashName ? tagOrHashName : defaultTag
      }.`
    );
  }

  const entries = entriesToDictionary(
    await entriesQueries.findByVersion(version.id)
  );

  return {
    id: configuration.id,
    name: configuration.name,
    tag: tag ? tag.name : "",
    hash: version.hash,
    previous: version.previous,
    defaultFormat: configuration.default_format,
    body: entries,
    state: configuration.state,
  };
};
