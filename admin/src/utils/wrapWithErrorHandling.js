export default cb => (effects, ...args) => {
    try {
        return Promise.resolve(cb(effects, ...args)).catch(
            error => console.error(error) || effects.setError(error.message),
        );
    } catch (error) {
        console.error(error);
        return effects.setError(error.message);
    }
};
