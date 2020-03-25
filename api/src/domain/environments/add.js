import hash from "object-hash";

import environmentsQueries from "../../queries/environments";
import configurationsQueries from "../../queries/configurations";
import versionsQueries from "../../queries/versions";
import { add as addTag } from "../configurations/tag";

import { LIVE } from "../common/states";
import { ENVVARS } from "../common/formats";

export default async (projectId, environmentName, configName = "default") => {
  // TODO (Kevin): Check if the environment already exists and return a usable error if it's the case
  // TODO (Kevin): Factorize the code with domain/configurations/add

  const environment = await environmentsQueries.insertOne({
    name: environmentName,
    project_id: projectId,
    state: LIVE,
  });

  const configuration = await configurationsQueries.insertOne({
    environment_id: environment.id,
    name: configName,
    default_format: ENVVARS,
  });

  const version = await versionsQueries.insertOne({
    configuration_id: configuration.id,
    hash: hash({ previous: null }),
    previous: null,
  });

  await addTag(configuration.id, version.id, "latest");

  return {
    ...environment,
    configurations: [configuration],
  };
};
