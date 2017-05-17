export default (...funcs) => async arg => funcs.reduce((prevRes, fn) => prevRes.then(fn), Promise.resolve(arg));
