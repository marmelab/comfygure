import client, { findOne, insertOne, updateOne } from "./knex";
import { LIVE } from "../domain/common/states";

const table = "project";

const fields = ["id", "name", "access_key as accessKey"];

const findFromIdAndToken = async (id, token) =>
  client
    .select(fields)
    .from(table)
    .where({
      id,
      state: LIVE
    })
    .andWhere(function() {
      return this.where({ write_token: token }).orWhere({ read_token: token });
    })
    .first();

export default {
  findOne: findOne(table, fields),
  insertOne: insertOne(table, fields),
  updateOne: updateOne(table, fields),
  findFromIdAndToken
};
