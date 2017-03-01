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

const insertOne = async version =>
    (await db.link(query)).insertOne(version);

const find = async configurationId =>
    (await db.link(query)).selectPage({
        configuration_id: configurationId,
    });

const findOneByHash = async (configurationId, hash) =>
    (await db.link(query)).selectOne({
        configuration_id: configurationId,
        hash,
    });

const findOneByTag = async (configurationId, tagId) =>
    (await db.link(query)).selectOne({
        configuration_id: configurationId,
        'tag.id': tagId,
    });

export default {
    insertOne,
    find,
    findOneByHash,
    findOneByTag,
};
