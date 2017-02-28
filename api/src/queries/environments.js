import { crudQueries } from 'co-postgres-queries';

import db from './db';

const base = crudQueries(
    'environment',
    ['name', 'state'],
    ['id'],
    ['id', 'name'],
    [
        queries => queries.selectPage
            .table('environment LEFT JOIN configuration ON (environment.id = configuration.environment_id')
            .returnFields(['environment.id', 'environment.name', 'json_agg(configuration.name)'])
            .groupByFields(['environment.id', 'environment.name']),
    ],
);

const insertOne = function* (environment) {
    const client = yield db.client();
    return yield client.query(
        base.insertOne(environment),
    );
};

const updateOne = function* (id, environment) {
    const client = yield db.client();
    return yield client.query(
        base.updateOne(id, environment),
    );
};

const select = function* (filters) {
    const client = yield db.client();
    return yield client.query(
        base.selectPage(undefined, undefined, filters),
    );
};

export default{
    insertOne,
    updateOne,
    select,
};
