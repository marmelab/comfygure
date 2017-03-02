import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'tag',
    ['configuration_id', 'version_id', 'name'],
    ['configuration_id', 'version_id', 'name'],
    ['name'],
);

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

const findOne = async (configurationId, tagName) => {
    const client = await db.link(query);
    const result = await client.selectOne({
        configuration_id: configurationId,
        name: tagName,
    });
    client.release();

    return result;
};

export default {
    updateOne,
    insertOne,
    findOne,
};
