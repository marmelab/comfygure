import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'entry',
    ['version_id', 'key', 'value'],
    ['version_id', 'key'],
    ['key', 'value'],
);

const insertOne = async entry => (await db.link(query)).insertOne(entry);

const findByVersion = async versionId => (await db.link(query)).selectPage({ version_id: versionId });

export default {
    insertOne,
    findByVersion,
};
