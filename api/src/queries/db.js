import { PgPool } from 'co-postgres-queries';
import config from 'config';

const pool = new PgPool(config.db.client, config.db.pooling);

const client = function* () {
    return yield pool.connect();
};

export default {
    client,
};
