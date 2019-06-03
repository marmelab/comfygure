const deepGet = require('lodash.get');

const traverse = (obj, parentKey = '') => {
    const list = [];

    if (Array.isArray(obj)) {
        obj.forEach((item, i) => {
            const traversed = traverse(item, `${parentKey}[${i}]`);
            traversed.forEach(t => {
                list.push(t);
            });
        });
    } else if (obj && obj.toString() === '[object Object]') {
        for (const key of Object.keys(obj)) {
            const pKey = parentKey ? `${parentKey}.` : '';
            const objectList = traverse(obj[key], `${pKey}${key}`);

            for (const objectItem of objectList) {
                list.push(objectItem);
            }
        }
    } else {
        list.push(parentKey);
    }

    return list;
};

const toFlat = body => {
    const content = {};
    const keyList = traverse(body);

    for (const key of keyList.sort()) {
        content[key] = deepGet(body, key);
    }

    return content;
};

module.exports = toFlat;
