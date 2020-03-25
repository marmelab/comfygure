import knex from "knex";

import config from "../config";

const client = knex({
  client: "pg",
  connection: config.db.client,
  pool: config.db.pooling,
  debug: false // Toggle this variable to log SQL queries
});

export const findOne = (table, fields, primaryKey = "id") => async identifier =>
  client
    .select(fields)
    .from(table)
    .where({ [primaryKey]: identifier })
    .first();

export const insertOne = (table, fields) => async row => {
  const results = await client(table)
    .insert(row)
    .returning(fields);

  return results[0]; // Cannot chain .first() on "insert" query
};

export const updateOne = (table, fields, primaryKey = "id") => async (
  identifier,
  row
) => {
  const results = await client(table)
    .where({ [primaryKey]: identifier })
    .update(row)
    .returning(fields);

  return results[0]; // Cannot chain .first() on "update" query
};

export default client;
