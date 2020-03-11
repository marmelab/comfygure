import knex from "knex";

import config from "../config";

const client = knex({
  client: "pg",
  connection: config.db.client,
  pool: config.db.pooling,
  debug: true
});

export default client;
