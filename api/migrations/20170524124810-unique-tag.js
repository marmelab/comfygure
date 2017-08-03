/* eslint-disable */
'use strict';

exports.up = function(db, cb) {
    db.runSql(
`DELETE FROM tag
    USING version
    WHERE version.id = tag.version_id AND EXISTS(
        SELECT *
        FROM tag t JOIN version v ON t.version_id = v.id
        WHERE v.created_at > version.created_at AND t.name = tag.name AND t.configuration_id = tag.configuration_id
    )
    RETURNING *;

ALTER TABLE tag ADD CONSTRAINT unique_tag UNIQUE (configuration_id, name);`,
    [], cb);
};

exports.down = function(db, cb) {
    db.runSql(
`
ALTER TABLE tag DROP CONSTRAINT unique_tag UNIQUE (configuration_id, name);
`,
    [], cb);
};

exports._meta = {
  "version": 1
};
