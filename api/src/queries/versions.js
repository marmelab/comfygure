import uuid from 'uuid/v4';

import db from './db';

export const insertOne = function* (version) {
    const insertedVersion = {
        id: uuid(),
        ...version,
    };
    db.versions.push(insertedVersion);
    return insertedVersion;
};

export const find = function* (configurationId) {
    return db.versions.filter(v => v.configuration_id === configurationId).map((v) => {
        const tag = db.tags.find(t => t.version_id === v.id);

        return {
            ...v,
            tag: tag ? tag.name : '',
        };
    });
};

export const findOneByHash = function* (configurationId, hash) {
    return db.versions.find(v =>
        v.configuration_id === configurationId &&
        v.hash === hash,
    );
};

export const findOneByTag = function* (configurationId, tagId) {
    const tag = db.tags.find(t =>
        t.configuration_id === configurationId &&
        t.id === tagId,
    );
    return db.versions.find(v => v.id === tag.version_id);
};

export default {
    insertOne,
    find,
    findOneByHash,
    findOneByTag,
};
