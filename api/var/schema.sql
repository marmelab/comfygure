--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.17
-- Dumped by pg_dump version 11.7 (Ubuntu 11.7-0ubuntu0.19.10.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: format; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.format AS ENUM (
    'json',
    'yaml',
    'envvars'
);


--
-- Name: state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.state AS ENUM (
    'live',
    'archived'
);


--
-- Name: token_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.token_level AS ENUM (
    'read',
    'write'
);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuration (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    environment_id uuid NOT NULL,
    name text NOT NULL,
    state public.state DEFAULT 'live'::public.state NOT NULL,
    default_format public.format,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: entry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entry (
    version_id uuid NOT NULL,
    key text NOT NULL,
    value text
);


--
-- Name: environment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.environment (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    name text NOT NULL,
    state public.state DEFAULT 'live'::public.state NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    state public.state DEFAULT 'live'::public.state NOT NULL,
    access_key character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tag (
    configuration_id uuid NOT NULL,
    version_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    name text NOT NULL,
    level public.token_level NOT NULL,
    key character varying(40) NOT NULL,
    state public.state DEFAULT 'live'::public.state NOT NULL,
    expiry_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.version (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    configuration_id uuid NOT NULL,
    hash character varying(64) NOT NULL,
    previous character varying(64),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: configuration configuration_environment_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_environment_id_name_key UNIQUE (environment_id, name);


--
-- Name: configuration configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_pkey PRIMARY KEY (id);


--
-- Name: entry entry_version_id_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entry
    ADD CONSTRAINT entry_version_id_key_key UNIQUE (version_id, key);


--
-- Name: environment environment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.environment
    ADD CONSTRAINT environment_pkey PRIMARY KEY (id);


--
-- Name: environment environment_project_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.environment
    ADD CONSTRAINT environment_project_id_name_key UNIQUE (project_id, name);


--
-- Name: project project_access_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_access_key_key UNIQUE (access_key);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: tag tag_configuration_id_version_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_configuration_id_version_id_name_key UNIQUE (configuration_id, version_id, name);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: token token_project_id_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_project_id_key_key UNIQUE (project_id, key);


--
-- Name: tag unique_tag; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT unique_tag UNIQUE (configuration_id, name);


--
-- Name: version version_configuration_id_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.version
    ADD CONSTRAINT version_configuration_id_hash_key UNIQUE (configuration_id, hash);


--
-- Name: version version_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.version
    ADD CONSTRAINT version_pkey PRIMARY KEY (id);


--
-- Name: configuration configuration_environment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_environment_id_fkey FOREIGN KEY (environment_id) REFERENCES public.environment(id) ON DELETE CASCADE;


--
-- Name: entry entry_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entry
    ADD CONSTRAINT entry_version_id_fkey FOREIGN KEY (version_id) REFERENCES public.version(id) ON DELETE CASCADE;


--
-- Name: environment environment_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.environment
    ADD CONSTRAINT environment_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON DELETE CASCADE;


--
-- Name: tag tag_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id) ON DELETE CASCADE;


--
-- Name: tag tag_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_version_id_fkey FOREIGN KEY (version_id) REFERENCES public.version(id) ON DELETE CASCADE;


--
-- Name: token token_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON DELETE CASCADE;


--
-- Name: version version_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.version
    ADD CONSTRAINT version_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id) ON DELETE CASCADE;


--
-- Name: version version_configuration_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.version
    ADD CONSTRAINT version_configuration_id_fkey1 FOREIGN KEY (configuration_id, previous) REFERENCES public.version(configuration_id, hash);


--
-- PostgreSQL database dump complete
--
