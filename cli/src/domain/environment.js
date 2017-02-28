const uuid = require('uuid');

module.exports = () => {
    const list = function* (project) {
        return [{
            id: uuid.v4(),
            name: 'development',
        }, {
            id: uuid.v4(),
            name: 'staging',
        }];
    };

    return { list };
};
