const CONFIG_FOLDER = '.comfy';
const CONFIG_PATH = '.comfy/config';
// TODO (Kevin): Document the command `DEFAULT_ORIGIN='http://localhost:3000' comfy init`
const DEFAULT_ORIGIN = process.env.DEFAULT_ORIGIN || 'https://comfy.marmelab.com';

module.exports = {
    CONFIG_FOLDER,
    CONFIG_PATH,
    DEFAULT_ORIGIN,
};
