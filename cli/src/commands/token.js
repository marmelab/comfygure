const formatDate = dateStr => {
  const date = new Date(dateStr);

  return date.toLocaleString();
};

const list = (ui, modules) =>
  function*() {
    const { dim, green, red } = ui.colors;
    const project = yield modules.project.retrieveFromConfig();
    const tokens = yield modules.token.list(project);

    for (const token of tokens) {
      const state =
        token.state === "archived"
          ? dim("disabled")
          : !token.expiry_date || new Date(token.expiry_date) > new Date()
          ? green("valid")
          : red("expired");

      ui.print(
        `${formatDate(token.created_at)}\t${token.name.padEnd(
          8,
          " "
        )}\t${state}`
      );
    }

    ui.exit();
  };

module.exports = (ui, modules) =>
  function*([command, ...options]) {
    yield list(ui, modules);
  };
