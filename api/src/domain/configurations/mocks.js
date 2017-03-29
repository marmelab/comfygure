import sinon from 'sinon';

import configurationsDomain from './index';
// import * as get from './get';
// import * as history from './history';
// import * as update from './update';
// import * as version from './version';

const sandbox = sinon.sandbox.create();

const mock = () => {
    sandbox.stub(configurationsDomain, 'add', () => ({}));
    sandbox.stub(configurationsDomain, 'get').returns({});
    sandbox.stub(configurationsDomain, 'history').returns([]);
    sandbox.stub(configurationsDomain, 'update');
    // sandbox.stub(version, 'get').returns({});
    // sandbox.stub(version, 'getDefault').returns({});

    return configurationsDomain;
};

const restore = () => {
    sandbox.restore();
};

export default {
    mock,
    restore,
};
