import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'tag',
    ['configuration_id', 'version_id', 'name'],
    ['configuration_id', 'version_id', 'name'],
    ['name'],
);

const updateOne = async (id, tag) =>
    (await db.link(query)).updateOne(id, tag);

const insertOne = async tag =>
    (await db.link(query)).insertOne(tag);

const findOne = async (configurationId, tagName) =>
    (await db.link(query)).selectOne({
        configuration_id: configurationId,
        name: tagName,
    });

export default {
    updateOne,
    insertOne,
    findOne,
};
