/* eslint-disable */
'use strict';

exports.up = function(db, cb) {
    db.runSql(`
        CREATE EXTENSION IF NOT EXISTS pgcrypto;

        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'state') THEN
                CREATE TYPE state AS ENUM (
                    'live',
                    'archived'
                );
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'format') THEN
                CREATE TYPE format AS ENUM (
                    'json',
                    'yaml',
                    'envvars'
                );
            END IF;

            CREATE TABLE IF NOT EXISTS project (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                state state NOT NULL DEFAULT 'live',
                access_key varchar(20) NOT NULL UNIQUE,
                read_token varchar(40) NOT NULL,
                write_token varchar(40) NOT NULL,
                created_at timestamp with time zone DEFAULT now() NOT NULL,
                updated_at timestamp with time zone DEFAULT now() NOT NULL
            );

            CREATE TABLE IF NOT EXISTS environment (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                project_id UUID NOT NULL REFERENCES project ON DELETE CASCADE,
                name TEXT NOT NULL,
                state state NOT NULL DEFAULT 'live',
                created_at timestamp with time zone DEFAULT now() NOT NULL,
                updated_at timestamp with time zone DEFAULT now() NOT NULL,
                UNIQUE(project_id, name)
            );

            CREATE TABLE IF NOT EXISTS configuration (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                environment_id UUID NOT NULL REFERENCES environment ON DELETE CASCADE,
                name TEXT NOT NULL,
                state state NOT NULL DEFAULT 'live',
                default_format format,
                created_at timestamp with time zone DEFAULT now() NOT NULL,
                updated_at timestamp with time zone DEFAULT now() NOT NULL,
                UNIQUE(environment_id, name)
            );

            CREATE TABLE IF NOT EXISTS version (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                configuration_id UUID NOT NULL REFERENCES configuration ON DELETE CASCADE,
                hash varchar(64) NOT NULL,
                previous varchar(64),
                created_at timestamp with time zone DEFAULT now() NOT NULL,
                UNIQUE(configuration_id, hash),
                FOREIGN KEY (configuration_id, previous) REFERENCES version(configuration_id, hash)
            );

            CREATE TABLE IF NOT EXISTS entry (
                version_id UUID NOT NULL REFERENCES version ON DELETE CASCADE,
                key TEXT NOT NULL,
                value TEXT,
                UNIQUE(version_id, key)
            );

            CREATE TABLE IF NOT EXISTS tag (
                configuration_id UUID NOT NULL REFERENCES configuration ON DELETE CASCADE,
                version_id UUID NOT NULL REFERENCES version ON DELETE CASCADE,
                name TEXT NOT NULL,
                created_at timestamp with time zone DEFAULT now() NOT NULL,
                updated_at timestamp with time zone DEFAULT now() NOT NULL,
                UNIQUE(configuration_id, version_id, name)
            );
        END$$;
    `, [], cb);
};

exports.down = function(db, cb) {
    db.runSql(`
        DROP TABLE tag;
        DROP TABLE entry;
        DROP TABLE version;
        DROP TABLE configuration;
        DROP TABLE environment;
        DROP TABLE project;
        DROP TYPE state;
        DROP TYPE format;
        DROP EXTENSION pgcrypto;
    `, [], cb);
};

exports._meta = {
    version: 1
};
