import get, { getEnvironmentOr404 } from './get';

import environmentsQueries from '../../queries/environments';

jest.mock('../../queries/environments');

describe('domain/environments/get', () => {
    describe('get', () => {
        it('should call the query with the right arguments', async () => {
            const projectId = 1;

            await get(projectId);

            expect(environmentsQueries.selectByProject).toHaveBeenCalledWith(projectId);
        });
    });

    describe('getEnvironmentOr404', () => {
        it('should retrieve an environment', async () => {
            const projectId = 42;
            const environmentName = 'prod';
            const env = await getEnvironmentOr404(projectId, environmentName);

            expect(environmentsQueries.findOne).toHaveBeenCalledWith(projectId, environmentName);
            expect(env).not.toBeUndefined();
        });

        it('should throw a NotFoundError if the env does not exist', async () => {
            const projectId = 42;
            const environmentName = 'prod';
            environmentsQueries.findOne.mockImplementation(() => Promise.resolve(null));

            try {
                await getEnvironmentOr404(projectId, environmentName);
            } catch (error) {
                expect(error.name).toBe('NotFoundError');
                return;
            }

            expect('The function should throw an error').toBe(false);
        });
    });
});
