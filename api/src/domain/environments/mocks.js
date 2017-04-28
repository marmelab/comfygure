import sinon from 'sinon';

import environmentsDomain from './index';

const sandbox = sinon.sandbox.create();

const mock = () => {
    sandbox.stub(environmentsDomain, 'add').returns({});
    sandbox.stub(environmentsDomain, 'get').returns([]);
    sandbox.stub(environmentsDomain, 'remove').returns({});
    sandbox.stub(environmentsDomain, 'rename').return({});

    return environmentsDomain;
};

const restore = () => {
    sandbox.restore();
};

export default {
    mock,
    restore,
};
