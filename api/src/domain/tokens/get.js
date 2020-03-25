import tokensQueries from "../../queries/tokens";

export default projectId => tokensQueries.findByProjectId(projectId);
