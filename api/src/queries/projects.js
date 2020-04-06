import { findOne, insertOne, updateOne } from "./knex";

const table = "project";

const fields = ["id", "name", "access_key as accessKey"];

export default {
  findOne: findOne(table, fields),
  insertOne: insertOne(table, fields),
  updateOne: updateOne(table, fields)
};
