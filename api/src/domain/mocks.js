import mockConfigurations from './configurations/mocks';
import mockEnvironments from './environments/mocks';

const restore = () => {
    mockConfigurations.restore();
    mockEnvironments.restore();
};

export default {
    configurations: mockConfigurations.mock,
    environments: mockEnvironments.mock,
    restore,
};
