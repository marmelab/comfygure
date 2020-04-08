import tokensQueries from "../../queries/tokens";

export default (projectId, all = false) =>
  tokensQueries.findByProjectId(projectId, all);
