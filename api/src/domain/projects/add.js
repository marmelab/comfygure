import { LIVE } from "../common/states";
import projectsQueries from "../../queries/projects";
import tokenQueries from "../../queries/tokens";
import addEnvironment from "../environments/add";

const generateRandomString = (size, upperAlphaOnly = false) => {
  const numeric = "0123456789";
  const lowerAlpha = "abcdefghijklmnopqrstuvwxyz";
  const upperAlpha = lowerAlpha.toUpperCase();

  const source = upperAlphaOnly
    ? upperAlpha
    : numeric + lowerAlpha + upperAlpha;

  let randomlyGeneratedString = "";

  while (randomlyGeneratedString.length < size) {
    const randomIndex = Math.floor(Math.random() * (source.length - 1));
    randomlyGeneratedString += source[randomIndex];
  }

  return randomlyGeneratedString;
};

export default async (
  name,
  environmentName = "default",
  configurationName = "default"
) => {
  const project = await projectsQueries.insertOne({
    name,
    state: LIVE,
    access_key: generateRandomString(20, true)
  });

  const environment = await addEnvironment(
    project.id,
    environmentName,
    configurationName
  );

  // p.id, 'read_only', 'read', p.read_token, NULL
  const [writeToken, readToken] = await Promise.all([
    tokenQueries.insertOne({
      project_id: project.id,
      name: "root",
      level: "write",
      key: generateRandomString(40),
      expiry_date: null
    }),
    tokenQueries.insertOne({
      project_id: project.id,
      name: "read_only",
      level: "read",
      key: generateRandomString(40),
      expiry_date: null
    })
  ]);

  return {
    ...project,
    environments: [environment],
    tokens: [readToken, writeToken],
    // Keep the following keys to not break retro-compatibility
    writeToken: writeToken.key,
    readToken: readToken.key
  };
};
