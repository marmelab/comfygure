import client, { findOne, insertOne, updateOne } from "./knex";

const table = "project";

const fields = [
  "id",
  "name",
  "access_key as accessKey",
  "read_token as readToken",
  "write_token as writeToken",
];

const findFromIdAndToken = async (id, token) =>
  client
    .select(fields)
    .from(table)
    .where({
      id,
      state: "live",
    })
    .andWhere(function () {
      return this.where({ write_token: token }).orWhere({ read_token: token });
    })
    .first();

export default {
  findOne: findOne(table, fields),
  insertOne: insertOne(table, fields),
  updateOne: updateOne(table, fields),
  findFromIdAndToken,
};
