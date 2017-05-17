export default cb => (effects, ...args) =>
    effects
        .setLoading(true)
        .then(() => cb(effects, ...args))
        .then(value => effects.setLoading(false).then(() => value));
