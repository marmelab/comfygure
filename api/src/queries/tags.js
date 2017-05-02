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
    const updateQuery = `
        UPDATE tag
            SET version_id=$version_id
        WHERE configuration_id = $id_configuration_id
            AND version_id = $id_version_id
            AND name = $id_name
        RETURNING configuration_id, version_id, name
    `;

    const result = await client.query({
        sql: updateQuery,
        parameters: {
            id_configuration_id: id.configuration_id,
            id_version_id: id.version_id,
            id_name: id.name,
            version_id: tag.version_id,
        },
    });

    client.release();

    if (!result.length) {
        return null;
    }

    return result[0];
};

const removeOne = async (id) => {
    const client = await db.link(query);
    const result = await client.deleteOne(id);
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
    removeOne,
    batchInsert,
    findOne,
};
