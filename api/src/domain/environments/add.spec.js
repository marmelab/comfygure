/* eslint no-unused-expressions: ["off"]*/

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import mock from '../../mocks';
import add from './add';
import { LIVE } from '../common/states';

describe('domain/environments/add', () => {
    const projectId = 1;
    const environmentName = 'production';
    const configurationName = 'frontend';

    let environmentsQueries;
    let configurationsQueries;

    beforeEach(() => {
        environmentsQueries = mock.queries.environments();

        mock.queries.entries();
        mock.queries.tags();
        mock.queries.versions();
    });

    it('should create an environment for the project', async () => {
        configurationsQueries = mock.queries.configurations({
            insertOne: () => ({ id: 1 }),
            findOne: () => ({ id: 1 }),
        });

        const environment = await add(projectId, environmentName);

        expect(environmentsQueries.insertOne)
            .to.have.been.calledWith({
                name: environmentName,
                project_id: projectId,
                state: LIVE,
            });

        expect(environment).to.be.truthy;

        expect(environment).to.contain({
            id: 1,
            name: environmentName,
            project_id: projectId,
            state: LIVE,
        });
    });

    it('should create a configuration for the project and the environment', async () => {
        configurationsQueries = mock.queries.configurations();
        const environment = await add(projectId, environmentName, configurationName);

        expect(configurationsQueries.insertOne)
            .to.have.been.calledWith({
                default_format: 'envvars',
                environment_id: 1,
                name: 'frontend',
            });

        expect(environment.configurations.length).to.equal(1);
        expect(environment.configurations[0].name).to.equal(configurationName);
    });

    it('should create the configuration as `default` if no name is provided', async () => {
        configurationsQueries = mock.queries.configurations();
        const environment = await add(projectId, environmentName);

        expect(configurationsQueries.insertOne)
            .to.have.been.calledWith({
                default_format: 'envvars',
                environment_id: 1,
                name: 'default',
            });

        expect(environment.configurations.length).to.equal(1);

        expect(environment.configurations[0].name).to.equal('default');
    });

    it('should return both environment and linked configurations', async () => {
        configurationsQueries = mock.queries.configurations();
        const environment = await add(projectId, environmentName, configurationName);

        expect(environment).to.contain({
            id: 1,
            name: environmentName,
            project_id: projectId,
            state: LIVE,
        });

        expect(environment.configurations[0].name).to.equal(configurationName);
    });

    afterEach(() => {
        mock.restore();
    });
});
