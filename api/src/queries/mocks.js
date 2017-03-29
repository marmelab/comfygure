import sinon from 'sinon';

import environmentsQueries from './environments';
import configurationsQueries from './configurations';
import entriesQueries from './entries';
import projectsQueries from './projects';
import tagsQueries from './tags';
import versionsQueries from './versions';

const sandbox = sinon.sandbox.create();

const environments = (fixtures = {}) => {
    sandbox.stub(environmentsQueries, 'insertOne', entity => (
        fixtures.insertOne ? { ...entity, ...fixtures.insertOne } : entity
    ));
    sandbox.stub(environmentsQueries, 'updateOne', (id, entity) => (
        fixtures.updateOne ? { ...entity, ...fixtures.updateOne } : entity
    ));
    sandbox.stub(environmentsQueries, 'findOne').returns(
        fixtures.findOne ? fixtures.findOne : {},
    );
    sandbox.stub(environmentsQueries, 'selectByProject').returns(
        fixtures.selectByProject ? fixtures.selectByProject : [],
    );

    return environmentsQueries;
};

const configurations = (fixtures = {}) => {
    sandbox.stub(configurationsQueries, 'findOne').returns(
        fixtures.findOne ? fixtures.findOne : null,
    );
    sandbox.stub(configurationsQueries, 'insertOne', entity => (
        fixtures.insertOne ? { ...entity, ...fixtures.insertOne } : entity
    ));

    return configurationsQueries;
};

const entries = (fixtures = {}) => {
    sandbox.stub(entriesQueries, 'insertOne', entity => (
        fixtures.insertOne ? { ...entity, ...fixtures.insertOne } : entity
    ));
    sandbox.stub(entriesQueries, 'findByVersion').returns(
        fixtures.findByVersion ? fixtures.findByVersion : [],
    );

    return entriesQueries;
};

const projects = (fixtures = {}) => {
    sandbox.stub(projectsQueries, 'insertOne', entity => (
        fixtures.insertOne ? { ...entity, ...fixtures.insertOne } : entity
    ));
    sandbox.stub(projectsQueries, 'updateOne', (id, entity) => (
        fixtures.updateOne ? { ...entity, ...fixtures.updateOne } : entity
    ));

    return projectsQueries;
};

const tags = (fixtures = {}) => {
    sandbox.stub(tagsQueries, 'insertOne', entity => (
        fixtures.insertOne ? { ...entity, ...fixtures.insertOne } : entity
    ));
    sandbox.stub(tagsQueries, 'updateOne', (id, entity) => (
        fixtures.updateOne ? { ...entity, ...fixtures.updateOne } : entity
    ));
    sandbox.stub(tagsQueries, 'batchInsert').returns(
        fixtures.batchInsert ? fixtures.batchInsert : [],
    );
    sandbox.stub(tagsQueries, 'findOne').returns(
        fixtures.findOne ? fixtures.findOne : {},
    );

    return tagsQueries;
};

const versions = (fixtures = {}) => {
    sandbox.stub(versionsQueries, 'insertOne', entity => (
        fixtures.insertOne ? { ...entity, ...fixtures.insertOne } : entity
    ));
    sandbox.stub(versionsQueries, 'find').returns(
        fixtures.find ? fixtures.find : [],
    );
    sandbox.stub(versionsQueries, 'findOneByHash').returns(
        fixtures.findOne ? fixtures.findOne : {},
    );
    sandbox.stub(versionsQueries, 'findOneByTag').returns(
        fixtures.findOne ? fixtures.findOne : {},
    );

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
