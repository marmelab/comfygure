import sinon from 'sinon';

import projectsDomain from './index';

const sandbox = sinon.sandbox.create();

const mock = () => {
    sandbox.stub(projectsDomain, 'add').returns({});
    sandbox.stub(projectsDomain, 'remove').returns({});
    sandbox.stub(projectsDomain, 'rename').return({});

    return projectsDomain;
};

const restore = () => {
    sandbox.restore();
};

export default {
    mock,
    restore,
};
