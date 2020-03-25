import tokenQueries from "../queries/tokens";

export const checkPermission = async (projectId, tokenKey, level) => {
  const token = await tokenQueries.findValidTokenByKey(projectId, tokenKey);

  if (!token) {
    throw new Error("Project ID or token is invalid.");
  }

  let permissionIsValid;

  switch (level) {
    case "write":
      permissionIsValid = token.level === "write";
      break;
    case "read":
      permissionIsValid = ["write", "read"].includes(token.level);
      break;
    default:
      throw new Error(`Level "${level}" doesn't exists.`);
  }

  if (!permissionIsValid) {
    throw new Error("Your token doesn't allow you to perform this action.");
  }
};
