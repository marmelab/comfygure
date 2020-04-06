import client, { insertOne } from "./knex";
import { LIVE } from "../domain/common/states";

const table = "token";

const fields = [
  "id",
  "project_id",
  "name",
  "level",
  "expiry_date",
  "created_at",
  "updated_at"
];

const findFromKeyAndProjectId = async (project_id, key) =>
  client
    .select(fields)
    .from(table)
    .where({
      key,
      project_id,
      state: LIVE
    })
    .andWhere(function() {
      return this.whereRaw("expiry_date > NOW()").orWhere({
        expiry_date: null
      });
    })
    .first();

export default {
  findFromKeyAndProjectId,
  insertOne: insertOne(table, [...fields, "key"])
};
