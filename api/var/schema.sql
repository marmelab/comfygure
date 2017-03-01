CREATE EXTENSION pgcrypto;

CREATE TYPE state AS ENUM (
    'live',
    'archived'
);

CREATE TYPE format AS ENUM (
    'json',
    'yaml',
    'envvars'
);

CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    state state NOT NULL DEFAULT 'live',
    access_key varchar(20) NOT NULL UNIQUE,
    read_token varchar(40) NOT NULL,
    write_token varchar(40) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE environment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project ON DELETE CASCADE,
    name TEXT NOT NULL,
    state state NOT NULL DEFAULT 'live',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(project_id, name)
);

CREATE TABLE configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id UUID NOT NULL REFERENCES environment ON DELETE CASCADE,
    name TEXT NOT NULL,
    state state NOT NULL DEFAULT 'live',
    default_format format,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(environment_id, name)
);

CREATE TABLE version (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_id UUID NOT NULL REFERENCES configuration ON DELETE CASCADE,
    hash varchar(64) NOT NULL,
    previous varchar(64),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(configuration_id, hash),
    FOREIGN KEY (configuration_id, previous) REFERENCES version(configuration_id, hash)
);

CREATE TABLE entry (
    version_id UUID NOT NULL REFERENCES version ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT,
    UNIQUE(version_id, key)
);

CREATE TABLE tag (
    configuration_id UUID NOT NULL REFERENCES configuration ON DELETE CASCADE,
    version_id UUID NOT NULL REFERENCES version ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(configuration_id, version_id, name)
);
