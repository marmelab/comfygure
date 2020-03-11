import knex from "knex";

import config from "../config";

const client = knex({
  client: "pg",
  connection: config.db.client,
  pool: config.db.pooling
});

export const findOne = (
  table,
  fields,
  primaryKey = "id"
) => async identifier => {
  const results = await client
    .select(fields)
    .from(table)
    .where({ [primaryKey]: identifier });

  return results[0];
};

export const insertOne = (table, fields) => async row => {
  const results = await client(table)
    .insert(row)
    .returning(fields);

  return results[0];
};

export const updateOne = (table, fields, primaryKey = "id") => async (
  identifier,
  row
) => {
  const results = await client(table)
    .where({ [primaryKey]: identifier })
    .update(row)
    .returning(fields);

  return results[0];
};

export default client;
