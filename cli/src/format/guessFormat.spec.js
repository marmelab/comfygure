const { JSON, YAML, ENVVARS } = require('./constants');
const guessFormat = require('./guessFormat');

describe('Format guessFormat', () => {
    it.each([
        ['.json', JSON],
        ['.yml', YAML],
        ['.yaml', YAML],
        ['.unknown', ENVVARS],
        [undefined, ENVVARS],
        [null, ENVVARS],
    ])('should transform extention "%s" into the format "%s"', (ext, format) => {
        expect(guessFormat(ext)).toBe(format);
    });
});
