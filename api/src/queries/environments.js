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
    .searchableFields(['environment.name', 'project_id', 'environment.state'])
    .returnFields(['environment.id', 'environment.name', 'case when count(configuration.name) = 0 then \'[]\' else json_agg((SELECT x FROM (SELECT configuration.id, configuration.name, configuration.default_format as "defaultFormat") x)) end as configurations'])
    .groupByFields(['environment.id', 'environment.name', 'environment.project_id'])
;

const insertOne = async (environment) => {
    const client = await db.link(query);
    const result = await client.insertOne(environment);
    client.release();

    return result;
};

const updateOne = async (id, environment) =>
    (await db.link(query)).updateOne(id, environment);

const findOne = async (projectId, environmentName) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, {
        project_id: projectId,
        'environment.name': environmentName,
    });
    client.release();

    if (!result.length) {
        return null;
    }
    return result[0];
};


const selectByProject = async (projectId) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, { project_id: projectId });
    client.release();

    return result;
};

export default {
    insertOne,
    updateOne,
    findOne,
    selectByProject,
};
