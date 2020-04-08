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

  const add = function*(project, name, level = "read", expiresInDays = null) {
    const url = `${project.origin}/projects/${project.id}/tokens`;
    const body = {
      name,
      level,
      expiresInDays,
    };

    try {
      return yield client.post(url, body, client.buildAuthorization(project));
    } catch (error) {
      ui.printRequestError(error);
      ui.exit(1);
    }
  };

  const remove = function*(project, id) {
    const url = `${project.origin}/projects/${project.id}/tokens/${id}`;

    try {
      return yield client.delete(url, client.buildAuthorization(project));
    } catch (error) {
      ui.printRequestError(error);
      ui.exit(1);
    }
  };

  return { list, add, remove };
};
