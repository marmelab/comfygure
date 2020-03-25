import { insertOne } from "./knex";

const table = "token";

const fields = [
  "id",
  "project_id",
  "name",
  "level",
  "key",
  "state",
  "expiry_date",
  "created_at",
  "updated_at"
];

export default {
  insertOne: insertOne(table, fields)
};
