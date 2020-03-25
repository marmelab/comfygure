module.exports = (client, ui) => {
  const list = function*(project) {
    const url = `${project.origin}/projects/${project.id}/tokens`;

    try {
      return yield client.get(url, client.buildAuthorization(project));
    } catch (error) {
      ui.printRequestError(error);
      ui.exit(1);
    }
  };

  return { list };
};
