import { crudQueries } from 'co-postgres-queries';

import db from './db';

const table = 'tag';
const fields = ['configuration_id', 'version_id', 'name'];
const idFields = ['configuration_id', 'version_id', 'name'];
const returnFields = ['configuration_id', 'version_id', 'name'];

const query = crudQueries(table, fields, idFields, returnFields);

query.updateOne = query.updateOne.allowPrimaryKeyUpdate(true);

const updateOne = async (id, tag) => {
    const client = await db.link(query);
    const result = await client.updateOne(id, tag);
    client.release();

    return result;
};

const insertOne = async (tag) => {
    const client = await db.link(query);
    const result = await client.insertOne(tag);
    client.release();

    return result;
};

const batchInsert = async (tags) => {
    const client = await db.link(query);
    const result = await client.batchInsert(tags);
    client.release();

    return result;
};

const findOne = async (configurationId, tagName) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, {
        configuration_id: configurationId,
        name: tagName,
    });
    client.release();

    if (!result.length) {
        return null;
    }

    return result[0];
};

export default {
    updateOne,
    insertOne,
    batchInsert,
    findOne,
};
