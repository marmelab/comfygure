import knex from "./knex";

const table = "project";

const fields = [
  "id",
  "name",
  "access_key as accessKey",
  "read_token as readToken",
  "write_token as writeToken"
];

const findOne = async id => {
  const results = await knex
    .select(fields)
    .from(table)
    .where({ id });

  return results[0];
};

const insertOne = async project => {
  const results = await knex(table)
    .insert(project)
    .returning(fields);

  return results[0];
};

const updateOne = async (id, project) => {
  const results = await knex(table)
    .where({ id })
    .update(project)
    .returning(fields);

  return results[0];
};

const findFromIdAndToken = async (id, token) => {
  const results = await knex
    .select(fields)
    .from(table)
    .where({
      id,
      state: "live"
    })
    .andWhere(function() {
      return this.where({ write_token: token }).orWhere({ read_token: token });
    });

  return results[0];
};

export default {
  findOne,
  insertOne,
  updateOne,
  findFromIdAndToken
};
