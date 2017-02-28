import uuid from 'uuid/v4';

import db from './db';

export const insertOne = function* (entry) {
    const insertedEntry = {
        id: uuid(),
        ...entry,
    };
    db.entries.push(insertedEntry);
    return insertedEntry;
};

export const findByVersion = function* (versionId) {
    return db.entries.filter(entry => entry.version_id === versionId);
};

export default {
    insertOne,
    findByVersion,
};
