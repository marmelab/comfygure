import { checkPermission } from "../../domain/permissions";
import { HttpError } from "./errors";

export const parseAuthorizationToken = (event) => {
  const { Authorization: authorizationHeader } = event.headers || {};

  if (!authorizationHeader) {
    throw new HttpError(401, "Authorization header should be set.");
  }

  const [type, token] = authorizationHeader.split(" ");

  if (type !== "Token" || !token) {
    throw new HttpError(403, "Authorization header format is invalid.");
  }

  return token;
};

export const checkAuthorizationOr403 = async (token, projectId, level) => {
  try {
    await checkPermission(projectId, token, level);
  } catch (e) {
    throw new HttpError(403, e.message);
  }
};
