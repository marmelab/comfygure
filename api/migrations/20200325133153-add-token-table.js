/* eslint-disable */
"use strict";

exports.up = function (db, cb) {
  db.runSql(
    `
    DO $$
    BEGIN
      CREATE TYPE token_level AS ENUM (
        'read',
        'write'
      );

      CREATE TABLE token (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES project ON DELETE CASCADE,
        name TEXT NOT NULL,
        level token_level NOT NULL,
        key varchar(40) NOT NULL,
        state state NOT NULL DEFAULT 'live',
        expiry_date timestamp with time zone,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        UNIQUE(project_id, key),
        UNIQUE(project_id, name)
      );

      INSERT INTO token ("project_id", "name", "level", "key", "expiry_date")
      SELECT p.id, 'root', 'write', p.write_token, NULL
      FROM project p;

      INSERT INTO token ("project_id", "name", "level", "key", "expiry_date")
      SELECT p.id, 'read_only', 'read', p.read_token, NULL
      FROM project p;

      ALTER TABLE project
        DROP COLUMN write_token,
        DROP COLUMN read_token;
    END$$;
  `,
    [],
    cb
  );
};

exports.down = function (db, cb) {
  db.runSql(
    `
    DO $$
    BEGIN
      ALTER TABLE project
        ADD COLUMN write_token varchar(40),
        ADD COLUMN read_token varchar(40);

      UPDATE project
      SET write_token = t."key" 
      FROM token t
      WHERE
        t.project_id = project.id AND
        t."level" = 'write' AND
        t."name" = 'root';
      
      UPDATE project
      SET read_token = t."key" 
      FROM token t
      WHERE
        t.project_id = project.id AND
        t."level" = 'read' AND
        t."name" = 'read_only';

      DROP TABLE token;
      DROP TYPE token_level;
    END$$;
  `,
    [],
    cb
  );
};

exports._meta = {
  version: 1,
};
