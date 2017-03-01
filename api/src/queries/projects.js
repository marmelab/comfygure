import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'project',
    ['name', 'state', 'access_key', 'read_token', 'write_token'],
    ['id'],
    ['id', 'name', 'access_key', 'read_token', 'write_token'],
);

const insertOne = async project =>
    (await db.link(query)).insertOne(project);

const updateOne = async (id, project) =>
    (await db.link(query)).updateOne(id, project);

export default {
    insertOne,
    updateOne,
};
