const insertOne = jest.fn(entity => Promise.resolve({ id: 1, ...entity }));
const find = jest.fn(() => Promise.resolve([]));
const findOneByHash = jest.fn(() => Promise.resolve({}));
const findOneByTag = jest.fn(() => Promise.resolve({}));

export default {
    insertOne,
    find,
    findOneByHash,
    findOneByTag,
};
