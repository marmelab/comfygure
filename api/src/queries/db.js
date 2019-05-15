import { PgPool } from 'co-postgres-queries';

import config from '../config';

const pool = new PgPool(config.db.client, config.db.pooling);

const link = async query => {
    const client = await pool.connect();
    const crud = await client.link(query);
    return {
        ...crud,
        release: client.release,
        query: client.query
    };
};

export default {
    link
};
