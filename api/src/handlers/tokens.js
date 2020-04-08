import λ from "./utils/λ";
import {
  checkAuthorizationOr403,
  parseAuthorizationToken,
} from "./utils/authorization";
import getTokens from "../domain/tokens/get";

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
