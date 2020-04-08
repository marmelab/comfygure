module.exports = (client, ui) => {
  const list = function*(project, all = false) {
    let url = `${project.origin}/projects/${project.id}/tokens`;

    if (all) {
      url += "?all";
    }

    try {
      return yield client.get(url, client.buildAuthorization(project));
    } catch (error) {
      ui.printRequestError(error);
      ui.exit(1);
    }
  };

  return { list };
};
