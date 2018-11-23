import { crudQueries } from 'co-postgres-queries';

import db from './db';

const table = 'configuration';
const fields = [
    'id',
    'environment_id',
    'name',
    'state',
    'default_format',
    'created_at',
    'updated_at',
];
const idFields = ['id'];
const returnFields = ['id', 'name', 'state', 'default_format'];

const query = crudQueries(table, fields, idFields, returnFields);

query.selectPage = query.selectPage
    .table(`
        project
        LEFT JOIN environment ON (project.id = environment.project_id)
        LEFT JOIN configuration ON (environment.id = configuration.environment_id)
    `)
    .searchableFields(['project_id', 'environment.name', 'configuration.name'])
    .idFields(['configuration.id'])
    .returnFields([
        'configuration.id',
        'configuration.environment_id',
        'configuration.name',
        'configuration.state',
        'configuration.default_format',
        'configuration.created_at',
        'configuration.updated_at',
        'environment.name as environment_name',
        'project.id as project_id',
    ]);

const findOne = async (projectId, environmentName, configurationName) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, {
        project_id: projectId,
        'environment.name': environmentName,
        'configuration.name': configurationName,
        state: 'live',
    });
    client.release();

    if (!result.length) {
        return null;
    }
    return result[0];
};

const findAllByEnvironmentName = async (projectId, environmentName) => {
    const client = await db.link(query);
    const result = await client.selectPage(undefined, undefined, {
        project_id: projectId,
        'environment.name': environmentName,
        state: 'live',
    });
    client.release();

    return result;
};

const insertOne = async (configurationData) => {
    const client = await db.link(query);
    const configuration = await client.insertOne(configurationData);
    client.release();
    return configuration;
};

const updateOne = async (id, data) => {
    const client = await db.link(query);
    const configuration = client.updateOne(id, data);
    client.release();

    return configuration;
};

export default {
    findOne,
    findAllByEnvironmentName,
    insertOne,
    updateOne,
};
