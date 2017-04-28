/* eslint no-unused-expressions: ["off"]*/

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import mock from '../../mocks';

import get from './get';

describe('domain/environments/get', () => {
    let environmentsQueries;

    beforeEach(() => {
        environmentsQueries = mock.queries.environments();
    });

    it('should call the  query with the right arguments', async () => {
        const projectId = 1;

        await get(projectId);

        expect(environmentsQueries.selectByProject.calledOnce).to.be.true;
        expect(environmentsQueries.selectByProject.firstCall.calledWith(projectId)).to.be.true;
    });

    afterEach(() => {
        mock.restore();
    });
});
