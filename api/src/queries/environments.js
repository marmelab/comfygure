import client, { insertOne, updateOne } from "./knex";

const table = "environment";
const fields = ["id", "name"];

const findOne = async (projectId, environmentName) =>
  client
    .select(fields)
    .from(table)
    .where({
      project_id: projectId,
      state: "live",
      name: environmentName
    })
    .first();

const selectByProject = async projectId => {
  const environments = await client
    .select(fields)
    .from(table)
    .where({
      project_id: projectId,
      state: "live"
    });

  return environments;
};

export default {
  insertOne: insertOne(table, fields),
  updateOne: updateOne(table, fields),
  findOne,
  selectByProject
};
