/* eslint no-unused-expressions: ["off"]*/

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import mock from '../../mocks';

import remove from './remove';
import { ARCHIVED } from '../common/states';

describe('domain/environments/remove', () => {
    const projectId = 1;
    const environmentName = 'staging';

    let environmentsQueries;

    beforeEach(() => {
        environmentsQueries = mock.queries.environments();
    });

    it('should try to find the environment by project id and name', async () => {
        await remove(projectId, environmentName);

        expect(environmentsQueries.findOne.calledOnce).to.be.true;
        expect(environmentsQueries.findOne.firstCall.calledWith(projectId, environmentName));
    });

    it('should set `ARCHIVED` state on environment', async () => {
        await remove(projectId, environmentName);

        expect(environmentsQueries.updateOne.calledOnce).to.be.true;
        expect(environmentsQueries.updateOne.firstCall.calledWith(undefined, {
            state: ARCHIVED,
        })).to.be.true;
    });

    afterEach(() => {
        mock.restore();
    });
});
