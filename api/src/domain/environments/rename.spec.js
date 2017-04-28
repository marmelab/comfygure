/* eslint no-unused-expressions: ["off"]*/

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import mock from '../../mocks';

import rename from './rename';

describe('domain/environments/rename', () => {
    const projectId = 1;
    const environmentName = 'staging';
    const newEnvironmentName = 'integration';

    let environmentsQueries;

    beforeEach(() => {
        environmentsQueries = mock.queries.environments();
    });

    it('should try to find the environment by project id and name', async () => {
        await rename(projectId, environmentName, newEnvironmentName);

        expect(environmentsQueries.findOne.calledOnce).to.be.true;
        expect(environmentsQueries.findOne.firstCall.calledWith(projectId, environmentName));
    });

    it('should change name on environment', async () => {
        await rename(projectId, environmentName, newEnvironmentName);

        expect(environmentsQueries.updateOne.calledOnce).to.be.true;
        expect(environmentsQueries.updateOne.firstCall.calledWith(undefined, {
            name: newEnvironmentName,
        })).to.be.true;
    });

    afterEach(() => {
        mock.restore();
    });
});
