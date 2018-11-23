import rename from './rename';

import environmentsQueries from '../../queries/environments';
import { getProjectOr404 } from '../projects/get';
import { getEnvironmentOr404 } from './get';

jest.mock('../../queries/environments');
jest.mock('./get');
jest.mock('../projects/get');

describe('domain/environments/rename', () => {
    const projectId = 1;
    const environmentName = 'staging';
    const newEnvironmentName = 'integration';

    it('should try to find the environment by project id and name', async () => {
        await rename(projectId, environmentName, newEnvironmentName);

        expect(getEnvironmentOr404).toHaveBeenCalledWith(projectId, environmentName);
    });

    it('should change name on environment', async () => {
        await rename(projectId, environmentName, newEnvironmentName);

        expect(environmentsQueries.updateOne).toHaveBeenCalledWith(undefined, {
            name: newEnvironmentName,
        });
    });
});
