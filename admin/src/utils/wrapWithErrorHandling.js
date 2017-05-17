export default cb => (effects, ...args) => cb(effects, ...args).catch(error => effects.setError(error.message));
