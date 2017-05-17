export default cb => (effects, ...args) => {
    try {
        const result = cb(effects, ...args);
        if (result.then) {
            return result.catch(error => effects.setError(error.message));
        }

        return result;
    } catch (error) {
        return effects.setError(error.message);
    }
};
