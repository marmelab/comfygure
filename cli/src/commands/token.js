const minimist = require("minimist");
const humanize = require("humanize-duration");

const help = (ui) => {
  const { bold, dim, cyan } = ui.colors;

  ui.print(`
${bold("NAME")}
      comfy token - Manage authentication tokens

${bold("SYNOPSIS")}
      ${bold("comfy")} token <command> [<options>]

${bold("COMMANDS")}
      list            List authentication tokens

${bold("OPTIONS")}
      -a, --all       List expired tokens too
      -h, --help      Show this very help message

${bold("EXAMPLES")}
      ${dim("# List all tokens, including expired ones")}
      ${cyan("comfy token list --all")}
`);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleString();
};

const renderTokenLevel = ({ level }) => {
  if (level === "read") {
    return "read only";
  }

  return "full permissions";
};

const renderTokenState = (ui, { expiry_date }) => {
  const { dim, green, red } = ui.colors;

  if (!expiry_date) {
    return `${green("active")} ${dim("(never expire)")}`;
  }

  const expiryDate = new Date(expiry_date);
  const duration = Math.abs(new Date() - expiryDate);

  if (expiryDate > new Date()) {
    return `${green("active")} ${dim(
      `(expires in ${humanize(duration, { largest: 1 })})`
    )}`;
  }

  return `${red("expired")} ${dim(
    `${humanize(duration, { largest: 1 })} ago`
  )}`;
};

const list = (ui, modules, options) =>
  function*() {
    const all = options.a || options.all;
    const project = yield modules.project.retrieveFromConfig();
    const tokens = yield modules.token.list(project, all);

    for (const token of tokens) {
      ui.print(
        `${formatDate(token.created_at)}\t${token.name.padEnd(
          8,
          " "
        )}\t${renderTokenLevel(token)}\t${renderTokenState(ui, token)}`
      );
    }

    ui.exit();
  };

module.exports = (ui, modules) =>
  function*([command, ...rawOptions]) {
    const options = minimist(rawOptions);

    if (options.help || options.h || options._.includes("help")) {
      help(ui);
      return ui.exit(0);
    }

    switch (command) {
      case "ls":
      case "list":
        yield list(ui, modules, options);
      default:
        help(ui);
    }
  };
