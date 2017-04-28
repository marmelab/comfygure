import { crudQueries } from 'co-postgres-queries';

import db from './db';

const table = 'project';

const readFields = [
    'id',
    'name',
    'access_key as "accessKey"',
    'read_token as "readToken"',
    'write_token as "writeToken"',
];

const query = crudQueries(
    table,
    ['name', 'state', 'access_key', 'read_token', 'write_token'],
    ['id'],
    readFields,
);

const insertOne = async (project) => {
    const client = await db.link(query);
    const result = await client.insertOne(project);
    client.release();

    return result;
};

const updateOne = async (id, project) => {
    const client = await db.link(query);
    const result = await client.updateOne(id, project);
    client.release();

    return result;
};

const findFromIdAndToken = async (id, token) => {
    const client = await db.link(query);
    const result = await client.query({
        sql: `
            SELECT ${readFields.join(', ')}
            FROM ${table}
            WHERE
                state = 'live'
                AND id = $id
                AND (write_token = $token OR read_token = $token)
        `,
        parameters: { id, token },
    });
    client.release();

    if (!result.length) {
        return null;
    }

    return result[0];
};

export default {
    insertOne,
    updateOne,
    findFromIdAndToken,
};
