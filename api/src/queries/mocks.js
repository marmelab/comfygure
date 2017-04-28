import sinon from 'sinon';

import environmentsQueries from './environments';
import configurationsQueries from './configurations';
import entriesQueries from './entries';
import projectsQueries from './projects';
import tagsQueries from './tags';
import versionsQueries from './versions';

const sandbox = sinon.sandbox.create();

const environments = (stubs = {}) => {
    sandbox.stub(environmentsQueries, 'insertOne', stubs.insertOne || (entity => (entity)));
    sandbox.stub(environmentsQueries, 'updateOne', stubs.updateOne || (entity => (entity)));
    sandbox.stub(environmentsQueries, 'findOne', stubs.findOne || (() => ({})));
    sandbox.stub(environmentsQueries, 'selectByProject', stubs.selectByProject || (() => ([])));

    return environmentsQueries;
};

const configurations = (stubs = {}) => {
    sandbox.stub(configurationsQueries, 'findOne', stubs.findOne || (() => ({})));
    sandbox.stub(configurationsQueries, 'insertOne', stubs.insertOne || (entity => (entity)));

    return configurationsQueries;
};

const entries = (stubs = {}) => {
    sandbox.stub(entriesQueries, 'insertOne', stubs.insertOne || (entity => (entity)));
    sandbox.stub(entriesQueries, 'findByVersion', stubs.findByVersion || (() => ([])));

    return entriesQueries;
};

const projects = (stubs = {}) => {
    sandbox.stub(projectsQueries, 'insertOne', stubs.insertOne || (entity => (entity)));
    sandbox.stub(projectsQueries, 'updateOne', stubs.updateOne || (entity => (entity)));

    return projectsQueries;
};

const tags = (stubs = {}) => {
    sandbox.stub(tagsQueries, 'insertOne', stubs.insertOne || (entity => (entity)));
    sandbox.stub(tagsQueries, 'updateOne', stubs.updateOne || (entity => (entity)));
    sandbox.stub(tagsQueries, 'batchInsert', stubs.batchInsert || (() => ([])));
    sandbox.stub(tagsQueries, 'findOne', stubs.findOne || (() => ({})));

    return tagsQueries;
};

const versions = (stubs = {}) => {
    sandbox.stub(versionsQueries, 'insertOne', stubs.insertOne || (entity => (entity)));
    sandbox.stub(versionsQueries, 'find', stubs.find || (() => ([])));
    sandbox.stub(versionsQueries, 'findOneByHash', stubs.findOneByHash || (() => ({})));
    sandbox.stub(versionsQueries, 'findOneByTag', stubs.findOneByTag || (() => ({})));

    return versionsQueries;
};

const restore = () => {
    sandbox.restore();
};

export default {
    environments,
    configurations,
    entries,
    projects,
    tags,
    versions,
    restore,
};
