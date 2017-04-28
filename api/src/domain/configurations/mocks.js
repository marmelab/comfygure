import sinon from 'sinon';

import configurationsDomain from './index';

const sandbox = sinon.sandbox.create();

const mock = () => {
    sandbox.stub(configurationsDomain, 'add', () => ({}));
    sandbox.stub(configurationsDomain, 'get').returns({});
    sandbox.stub(configurationsDomain, 'history').returns([]);
    sandbox.stub(configurationsDomain, 'update');

    return configurationsDomain;
};

const restore = () => {
    sandbox.restore();
};

export default {
    mock,
    restore,
};
