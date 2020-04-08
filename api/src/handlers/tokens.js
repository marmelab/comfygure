import λ from "./utils/λ";
import {
  checkAuthorizationOr403,
  parseAuthorizationToken,
} from "./utils/authorization";
import getTokens from "../domain/tokens/get";
import addToken from "../domain/tokens/add";
import removeToken from "../domain/tokens/remove";

export const get = λ(async (event) => {
  const { id: projectId } = event.pathParameters || {};
  await checkAuthorizationOr403(
    parseAuthorizationToken(event),
    projectId,
    "read"
  );

  const all =
    event.queryStringParameters &&
    Object.keys(event.queryStringParameters).includes("all");

  return getTokens(projectId, all);
});

export const create = λ(async (event) => {
  const { id: projectId } = event.pathParameters;
  const { name, level, expiresInDays } = event.body;

  await checkAuthorizationOr403(
    parseAuthorizationToken(event),
    projectId,
    "write"
  );

  return addToken(projectId, name, level, expiresInDays);
});

export const remove = λ(async (event) => {
  const { id: projectId, tokenId } = event.pathParameters;

  await checkAuthorizationOr403(
    parseAuthorizationToken(event),
    projectId,
    "write"
  );

  return removeToken(tokenId);
});
