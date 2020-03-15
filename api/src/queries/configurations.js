import omit from "lodash.omit";
import client, {
  insertOne as insertOneQuery,
  updateOne as updateOneQuery
} from "./knex";

const table = "configuration";
const fields = [
  "configuration.id",
  "configuration.name",
  "configuration.state",
  "configuration.environment_id",
  "configuration.default_format",
  "configuration.created_at",
  "configuration.updated_at",
  "environment.name as environment_name",
  "environment.project_id as project_id"
];

const findOne = async (projectId, environmentName, configurationName) =>
  client
    .select(fields)
    .from(table)
    .innerJoin("environment", "environment.id", "configuration.environment_id")
    .where({
      project_id: projectId,
      "environment.name": environmentName,
      "configuration.name": configurationName,
      "configuration.state": "live"
    })
    .first();

const findAllByEnvironmentName = async (projectId, environmentName) =>
  client
    .select(fields)
    .from(table)
    .innerJoin("environment", "environment.id", "configuration.environment_id")
    .where({
      project_id: projectId,
      "environment.name": environmentName,
      "configuration.state": "live"
    });

const insertOne = async data => {
  const { id } = await insertOneQuery(table, ["id"])(data);

  return client
    .select(fields)
    .from(table)
    .innerJoin("environment", "environment.id", "configuration.environment_id")
    .where({
      "configuration.id": id
    })
    .first();
};

const updateOne = async (id, data) => {
  await updateOneQuery(table, ["id"])(
    id,
    omit(data, ["project_id", "environment_name"])
  );

  return client
    .select(fields)
    .from(table)
    .innerJoin("environment", "environment.id", "configuration.environment_id")
    .where({
      "configuration.id": id
    })
    .first();
};

export default {
  findOne,
  findAllByEnvironmentName,
  insertOne,
  updateOne
};
