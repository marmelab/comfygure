import client, { insertOne } from "./knex";

const table = "tag";
const fields = ["configuration_id", "version_id", "name"];

const updateOne = async (tag, { version_id: newVersionId }) => {
  const results = await client(table)
    .where(tag)
    .update({ version_id: newVersionId })
    .returning(fields);

  return results[0]; // Cannot chain .first() on "update" query
};

const removeOne = async tag => {
  const results = await client(table)
    .where(tag)
    .del()
    .returning(fields);

  return results[0]; // Cannot chain .first() on "del" query
};

const batchInsert = async tags =>
  client(table)
    .insert(tags)
    .returning(fields);

const findOne = async (configurationId, tagName) =>
  client
    .select(fields)
    .from(table)
    .where({ configuration_id: configurationId, name: tagName })
    .first();

export default {
  updateOne,
  insertOne: insertOne(table, fields),
  removeOne,
  batchInsert,
  findOne
};
