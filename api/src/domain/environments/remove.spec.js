import remove from './remove';
import { ARCHIVED } from '../common/states';

import environmentsQueries from '../../queries/environments';
import { getEnvironmentOr404 } from './get';

jest.mock('../../queries/environments');
jest.mock('./get');
jest.mock('../projects/get');

describe('domain/environments/remove', () => {
    const projectId = 1;
    const environmentName = 'staging';

    it('should try to find the environment by project id and name', async () => {
        await remove(projectId, environmentName);

        expect(getEnvironmentOr404).toHaveBeenCalledWith(projectId, environmentName);
    });

    it('should set `ARCHIVED` state on environment', async () => {
        await remove(projectId, environmentName);

        expect(environmentsQueries.updateOne).toHaveBeenCalledWith(undefined, {
            state: ARCHIVED,
        });
    });
});
