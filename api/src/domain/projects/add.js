import { LIVE } from "../common/states";
import projectsQueries from "../../queries/projects";
import addEnvironment from "../environments/add";
import addToken from "../tokens/add";
import generateRandomString from "../tokens/generateRandomString";

export default async (
  name,
  environmentName = "default",
  configurationName = "default"
) => {
  const project = await projectsQueries.insertOne({
    name,
    state: LIVE,
    access_key: generateRandomString(20, true),
  });

  const environment = await addEnvironment(
    project.id,
    environmentName,
    configurationName
  );

  const writeToken = await addToken(project.id, "root", "write");

  return {
    ...project,
    environments: [environment],
    tokens: [writeToken],
    // Keep the following keys to not break retro-compatibility
    writeToken: writeToken.key,
    readToken: null,
  };
};
