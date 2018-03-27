import add from './add';
import { LIVE } from '../common/states';

import environmentsQueries from '../../queries/environments';
import configurationsQueries from '../../queries/configurations';

jest.mock('../../queries/environments');
jest.mock('../../queries/configurations');
jest.mock('../../queries/versions');
jest.mock('../configurations/tag');

describe('domain/environments/add', () => {
    const projectId = 1;
    const environmentName = 'production';
    const configurationName = 'frontend';

    it('should create an environment for the project', async () => {
        const environment = await add(projectId, environmentName);

        expect(environmentsQueries.insertOne).toHaveBeenCalledWith({
            name: environmentName,
            project_id: projectId,
            state: LIVE,
        });

        expect(environment).toBeTruthy();

        expect(environment).toMatchObject({
            id: 1,
            name: environmentName,
            project_id: projectId,
            state: LIVE,
        });
    });

    it('should create a configuration for the project and the environment', async () => {
        const environment = await add(projectId, environmentName, configurationName);

        expect(configurationsQueries.insertOne).toHaveBeenCalledWith({
            default_format: 'envvars',
            environment_id: 1,
            name: 'frontend',
        });

        expect(environment.configurations.length).toEqual(1);
        expect(environment.configurations[0].name).toEqual(configurationName);
    });

    it('should create the configuration as `default` if no name is provided', async () => {
        const environment = await add(projectId, environmentName);

        expect(configurationsQueries.insertOne).toHaveBeenCalledWith({
            default_format: 'envvars',
            environment_id: 1,
            name: 'default',
        });

        expect(environment.configurations.length).toEqual(1);

        expect(environment.configurations[0].name).toEqual('default');
    });

    it('should return both environment and linked configurations', async () => {
        const environment = await add(projectId, environmentName, configurationName);

        expect(environment).toMatchObject({
            id: 1,
            name: environmentName,
            project_id: projectId,
            state: LIVE,
        });

        expect(environment.configurations[0].name).toEqual(configurationName);
    });
});
