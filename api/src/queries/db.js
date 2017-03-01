import { PgPool } from 'co-postgres-queries';
import config from 'config';

const pool = new PgPool(config.db.client, config.db.pooling);

const client = async () => pool.connect();

const link = async query => (await client()).link(query);

export default {
    client,
    link,
};
