import { raw } from "knex";
import client, { insertOne } from "./knex";

const table = "version";
const fields = ["id", "configuration_id", "hash", "previous", "created_at"];

const prefix = pre => str => `${pre}.${str}`;

const selectVersions = async (whereConditions, single = true) => {
  const versions = await client
    .select([
      ...fields.map(prefix(table)),
      raw(
        "case when count(tag.name) = 0 then '[]' else json_agg(tag.name) end as tags"
      )
    ])
    .leftJoin("tag", "tag.version_id", "version.id")
    .from(table)
    .where(whereConditions)
    .groupBy(fields.map(prefix(table)));

  if (single) {
    return versions[0];
  }

  return versions;
};

const findOne = async id => selectVersions({ "version.id": id });

const find = async configurationId =>
  selectVersions(
    {
      "version.configuration_id": configurationId
    },
    false
  );

const findOneByHash = async (configurationId, hash) =>
  selectVersions({
    "version.configuration_id": configurationId,
    "version.hash": hash
  });

const findOneByTag = async (configurationId, tagId) =>
  selectVersions({
    "version.configuration_id": configurationId,
    "tag.id": tagId
  });

export default {
  findOne,
  insertOne: insertOne(table, fields),
  find,
  findOneByHash,
  findOneByTag
};
