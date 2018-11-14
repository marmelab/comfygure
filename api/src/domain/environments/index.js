import add from './add';
import get, { getEnvironmentOr404 } from './get';
import remove from './remove';
import rename from './rename';

export { getEnvironmentOr404 };

export default {
    add,
    get,
    getEnvironmentOr404,
    remove,
    rename,
};
