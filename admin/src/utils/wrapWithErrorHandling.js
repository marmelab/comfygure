export default cb => (effects, ...args) => {
    try {
        return Promise.resolve(cb(effects, ...args)).catch(error => effects.setError(error.message));
    } catch (error) {
        return effects.setError(error.message);
    }
};
