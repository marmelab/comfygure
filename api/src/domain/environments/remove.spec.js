import remove from './remove';
import { ARCHIVED } from '../common/states';

import environmentsQueries from '../../queries/environments';

jest.mock('../../queries/environments');

describe('domain/environments/remove', () => {
    const projectId = 1;
    const environmentName = 'staging';

    it('should try to find the environment by project id and name', async () => {
        await remove(projectId, environmentName);

        expect(environmentsQueries.findOne).toHaveBeenCalledWith(projectId, environmentName);
    });

    it('should set `ARCHIVED` state on environment', async () => {
        await remove(projectId, environmentName);

        expect(environmentsQueries.updateOne).toHaveBeenCalledWith(undefined, {
            state: ARCHIVED,
        });
    });
});
