import { getProjectOr404 } from './get';

import projectsQueries from '../../queries/projects';

jest.mock('../../queries/projects');

describe('domain/projects/get', () => {
    describe('getProjectOr404', () => {
        it('should retrieve an environment', async () => {
            const env = await getProjectOr404(42);

            expect(projectsQueries.findOne).toHaveBeenCalledWith(42);
            expect(env).not.toBeUndefined();
        });

        it('should throw a NotFoundError if the env does not exist', async () => {
            projectsQueries.findOne.mockImplementation(() => Promise.resolve(null));

            try {
                await getProjectOr404(42);
            } catch (error) {
                expect(error.name).toBe('NotFoundError');
                return;
            }

            expect('The function should throw an error').toBe(false);
        });
    });
});
