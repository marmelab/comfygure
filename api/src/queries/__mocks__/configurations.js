const insertOne = jest.fn(entity => Promise.resolve({ id: 1, ...entity }));
const findOne = jest.fn(() => Promise.resolve({}));

export default {
    insertOne,
    findOne,
};
