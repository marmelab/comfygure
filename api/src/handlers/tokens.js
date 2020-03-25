import λ from "./utils/λ";
import {
  checkAuthorizationOr403,
  parseAuthorizationToken
} from "./utils/authorization";
import getTokens from "../domain/tokens/get";

export const get = λ(async event => {
  const { id: projectId } = event.pathParameters || {};
  await checkAuthorizationOr403(
    parseAuthorizationToken(event),
    projectId,
    "read"
  );

  return getTokens(projectId);
});
