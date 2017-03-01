import { crudQueries } from 'co-postgres-queries';

import db from './db';

const query = crudQueries(
    'environment',
    ['name', 'state', 'project_id'],
    ['id'],
    ['id', 'name'],
);

query.selectPage
    .table('environment LEFT JOIN configuration ON (environment.id = configuration.environment_id)')
    .idFields(['id'])
    .searchableFields(['environment.name', 'project_id'])
    .returnFields(['environment.id', 'environment.name', 'json_agg(configuration.name) as configurations'])
    .groupByFields(['environment.id', 'environment.name', 'environment.project_id'])
;

const insertOne = async environment =>
    (await db.link(query)).insertOne(environment);

const updateOne = async (id, environment) =>
    (await db.link(query)).updateOne(id, environment);

const selectByProject = async projectId =>
    (await db.link(query)).selectPage(undefined, undefined, { project_id: projectId });

export default {
    insertOne,
    updateOne,
    selectByProject,
};
