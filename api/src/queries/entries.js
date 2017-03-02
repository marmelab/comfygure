import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'entry',
    ['version_id', 'key', 'value'],
    ['version_id', 'key'],
    ['key', 'value'],
);

const insertOne = async (entry) => {
    const client = await db.link(query);
    const result = await client.insertOne(entry);
    client.release();

    return result;
};

const findByVersion = async (versionId) => {
    const client = await db.link(query);
    const result = await client.selectPage({ version_id: versionId });
    client.release();

    return result;
};

export default {
    insertOne,
    findByVersion,
};
