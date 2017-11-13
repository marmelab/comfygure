import rename from './rename';

import environmentsQueries from '../../queries/environments';

jest.mock('../../queries/environments');

describe('domain/environments/rename', () => {
    const projectId = 1;
    const environmentName = 'staging';
    const newEnvironmentName = 'integration';

    it('should try to find the environment by project id and name', async () => {
        await rename(projectId, environmentName, newEnvironmentName);

        expect(environmentsQueries.findOne).toHaveBeenCalledWith(projectId, environmentName);
    });

    it('should change name on environment', async () => {
        await rename(projectId, environmentName, newEnvironmentName);

        expect(environmentsQueries.updateOne).toHaveBeenCalledWith(undefined, {
            name: newEnvironmentName,
        });
    });
});
