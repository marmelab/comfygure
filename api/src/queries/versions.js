import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'version',
    ['id', 'configuration_id', 'hash', 'previous'],
    ['id'],
    ['hash', 'previous'],
);

query.selectPage
    .table('version LEFT JOIN tag on (version.id = tag.version_id)')
    .searchableFields(['configuration_id'])
    .returnFields(['hash', 'previous', 'tag.name'])
;

query.selectOne
    .table('version LEFT JOIN tag on (version.id = tag.version_id)')
    .searchableFields(['configuration_id', 'hash', 'tag.id'])
    .returnFields(['hash', 'previous', 'tag.name'])
;

const insertOne = async (version) => {
    const client = await db.link(query);
    const result = await client.insertOne(version);
    client.release();

    return result;
};

const find = async (configurationId) => {
    const client = await db.link(query);
    const result = await client.selectPage({
        configuration_id: configurationId,
    });
    client.release();

    return result;
};

const findOneByHash = async (configurationId, hash) => {
    const client = await db.link(query);
    const result = await client.selectOne({
        configuration_id: configurationId,
        hash,
    });
    client.release();

    return result;
};

const findOneByTag = async (configurationId, tagId) => {
    const client = await db.link(query);
    const result = await client.selectOne({
        configuration_id: configurationId,
        'tag.id': tagId,
    });
    client.release();

    return result;
};

export default {
    insertOne,
    find,
    findOneByHash,
    findOneByTag,
};
