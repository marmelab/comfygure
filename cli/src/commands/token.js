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
      list [options]          List authentication tokens
      add <name> [options]    Create a new token (default: read only, never expire)

${bold("OPTIONS")}
      -a, --all               List expired tokens too
      --full-access           Create a token with full access permissions
      -e, --expires-in        Create a token with an expiry date (number of days)
      -h, --help              Show this very help message

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
    return "read only".padEnd(16, " ");
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

    const maxNameLength = tokens
      .map((token) => token.name)
      .reduce((max, name) => {
        if (name.length > max) {
          return name.length;
        }

        return max;
      }, 0);

    for (const token of tokens) {
      const name = token.name.padEnd(maxNameLength, " ");

      ui.print(
        `${formatDate(token.created_at)}\t${name}\t${renderTokenLevel(
          token
        )}\t${renderTokenState(ui, token)}`
      );
    }

    ui.exit();
  };

const add = (ui, modules, options) =>
  function*() {
    const { red, bold, green } = ui.colors;

    if (options._.length < 1) {
      ui.error(red("Missing token name"));
    }

    if (options._.length > 1) {
      ui.error(red("Too many arguments"));
    }

    if (options._.length !== 1) {
      ui.print(`${bold("SYNOPSIS")}
        ${bold("comfy")} token add <name> --full-access=<false> --expires-in=<0>

Type ${green("comfy token --help")} for details`);
      return ui.exit(0);
    }

    const name = options._[0];
    const level = options["full-access"] ? "write" : "read";
    const expiresInDays = options.e || options["expires-in"] || null;

    const project = yield modules.project.retrieveFromConfig();
    const token = yield modules.token.add(project, name, level, expiresInDays);

    ui.print(`${bold(green("Token successfully created"))}`);
    ui.print(
      "Make sure to copy your new access token now. You won't be able to see it again!"
    );
    ui.print(`${green("✓")} ${token.key}`);
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
        break;
      case "add":
      case "create":
        yield add(ui, modules, options);
        break;
      default:
        help(ui);
    }
  };
