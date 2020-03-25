import client, { insertOne } from "./knex";

const table = "entry";
const fields = ["version_id", "key", "value"];

const findByVersion = async (version_id) =>
  client.select(fields).from(table).where({ version_id });

export default {
  insertOne: insertOne(table, fields),
  findByVersion,
};
