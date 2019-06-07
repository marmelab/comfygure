const { toEnvVars, toJavascript } = require('./');

describe('Format', () => {
    describe('toEnvVars', () => {
        it('should handle null value', () => {
            expect(toEnvVars({ key: '' })).toEqual("export KEY='';\n");
            expect(toEnvVars({ key: null })).toEqual("export KEY='';\n");
            expect(toEnvVars({ key: undefined })).toEqual("export KEY='';\n");
        });

        it('should handle multiple level of children', () => {
            expect(toEnvVars({ 'key.a': 'value' })).toEqual("export KEY_A='value';\n");
            expect(toEnvVars({ 'key.a.b': 'value' })).toEqual("export KEY_A_B='value';\n");
        });

        it('should handle (nested) lists', () => {
            expect(toEnvVars({ 'key[0]': 'value' })).toEqual("export KEY_0='value';\n");
            expect(toEnvVars({ 'key[0].a[0].b': 'value' })).toEqual("export KEY_0_A_0_B='value';\n");
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

            expect(toJavascript(config)).toEqual(
                'window.COMFY = {"nullable":null,"admin":"admin","password":"S3cret!","permissions":["read","write"],"attributes":{"size":42}};'
            );
        });
    });
});
