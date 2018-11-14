const findOne = jest.fn(id => Promise.resolve({ id }));

export default {
    findOne,
};
