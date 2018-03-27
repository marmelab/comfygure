const insertOne = jest.fn(entity => Promise.resolve({ id: 1, ...entity }));
const updateOne = jest.fn(entity => Promise.resolve(entity));
const findOne = jest.fn(() => Promise.resolve({}));
const selectByProject = jest.fn(() => Promise.resolve([]));

export default {
    insertOne,
    updateOne,
    findOne,
    selectByProject,
};
