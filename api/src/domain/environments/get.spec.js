import get from './get';

import environmentsQueries from '../../queries/environments';

jest.mock('../../queries/environments');

describe('domain/environments/get', () => {
    it('should call the  query with the right arguments', async () => {
        const projectId = 1;

        await get(projectId);

        expect(environmentsQueries.selectByProject).toHaveBeenCalledWith(projectId);
    });
});
