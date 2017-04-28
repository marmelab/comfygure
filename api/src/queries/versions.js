import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'version',
    ['id', 'configuration_id', 'hash', 'previous'],
    ['id'],
    ['id', 'configuration_id', 'hash', 'previous'],
);

query.selectPage = query.selectPage
    .table('version LEFT JOIN tag on (version.id = tag.version_id)')
    .searchableFields(['version.configuration_id'])
    .returnFields([
        'version.id',
        'hash',
        'previous',
        'version.configuration_id',
        "case when count(tag.name) = 0 then '[]' else json_agg(tag.name) end as tags",
    ])
    .groupByFields(['version.id', 'version.hash', 'version.previous'])
;

const findOne = async (version) => {
    const client = await db.link(query);
    const result = await client.selectOne(version);
    client.release();

    return result;
};

const insertOne = async (version) => {
    const client = await db.link(query);
    const result = await client.insertOne(version);
    client.release();

    return result;
};

const find = async (configurationId) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, {
        'version.configuration_id': configurationId,
    });
    client.release();

    return result;
};

const findOneByHash = async (configurationId, hash) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, {
        configuration_id: configurationId,
        hash,
    });
    client.release();

    if (!result.length) {
        return null;
    }
    return result[0];
};

const findOneByTag = async (configurationId, tagId) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, {
        'version.configuration_id': configurationId,
        'tag.id': tagId,
    });
    client.release();

    if (!result.length) {
        return null;
    }
    return result[0];
};

export default {
    findOne,
    insertOne,
    find,
    findOneByHash,
    findOneByTag,
};
