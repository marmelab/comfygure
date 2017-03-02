import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'project',
    ['name', 'state', 'access_key', 'read_token', 'write_token'],
    ['id'],
    ['id', 'name', 'access_key', 'read_token', 'write_token'],
);

const insertOne = async (project) => {
    const client = await db.link(query);
    const result = await client.insertOne(project);
    client.release();

    return result;
};

const updateOne = async (id, project) => {
    const client = await db.link(query);
    const result = await client.updateOne(id, project);
    client.release();

    return result;
};

export default {
    insertOne,
    updateOne,
};
