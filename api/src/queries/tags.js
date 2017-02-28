import uuid from 'uuid/v4';

import db from './db';

export const updateOne = function* (id, tag) {
    const found = db.tags.find(t => t.id === id);
    if (found) {
        Object.assign(found, tag);
    }
};

export const insertOne = function* (tag) {
    const insertedTag = {
        id: uuid(),
        ...tag,
    };
    db.tags.push(insertedTag);
    return insertedTag;
};

export const findOne = function* (configurationId, tagName) {
    return db.tags.find(t =>
        t.configuration_id === configurationId &&
        t.name === tagName,
    );
};

export default {
    updateOne,
    insertOne,
    findOne,
};
