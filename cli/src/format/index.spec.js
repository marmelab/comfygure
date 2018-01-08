const { toEnvVars, toJavascript } = require('./');

describe('Format', () => {
    describe('toEnvVars', () => {
        it('should handle null value', () => {
            expect(toEnvVars({ key: '' })).toEqual("export KEY='';\n");
            expect(toEnvVars({ key: null })).toEqual("export KEY='';\n");
            expect(toEnvVars({ key: undefined })).toEqual("export KEY='';\n");
        });
    });

    describe('toJavascript', () => {
        it('should transform a config into a javascript object', () => {
            const config = {
                key: undefined,
                nullable: null,
                admin: 'admin',
                password: 'S3cret!',
                permissions: ['read', 'write'],
                attributes: { size: 42 },
            };

            expect(toJavascript(config)).toEqual('window.COMFY = {"nullable":null,"admin":"admin","password":"S3cret!","permissions":["read","write"],"attributes":{"size":42}};');
        });
    });
});
