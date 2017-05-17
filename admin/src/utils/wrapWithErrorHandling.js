export default cb => (effects, ...args) => {
    return cb(effects, ...args).then(value => value, error => effects.setError(error.message));
};
