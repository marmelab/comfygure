import { PgPool } from 'co-postgres-queries';

const pool = new PgPool(CONFIG.db.client, CONFIG.db.pooling);

const link = async (query) => {
    const client = await pool.connect();
    const crud = await client.link(query);
    return {
        ...crud,
        release: client.release,
        query: client.query,
    };
};

export default {
    link,
};
