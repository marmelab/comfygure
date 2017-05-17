export default cb => (effects, ...args) => {
    try {
        return effects
            .setLoading(true)
            .then(() => cb(effects, ...args))
            .then(value => effects.setLoading(false).then(() => value))
            .catch(error => {
                effects.setLoading(false);
                throw error;
            });
    } catch (error) {
        effects.setLoading(false);
        throw error;
    }
};
