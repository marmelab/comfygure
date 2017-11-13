const { toEnvVars } = require('./');

describe('Format', () => {
    describe('toEnvVars', () => {
        it('should handle null value', () => {
            expect(toEnvVars({ key: '' })).toEqual("export KEY='';\n");
            expect(toEnvVars({ key: null })).toEqual("export KEY='';\n");
            expect(toEnvVars({ key: undefined })).toEqual("export KEY='';\n");
        });
    });
});
