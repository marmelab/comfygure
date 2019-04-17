const expect = require('expect');
const { run, createProject } = require('../cli');

describe('Commands', () => {
    beforeEach(createProject);

    describe('setall', () => {
        it('should accept relative path for config', function* () {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);
        });

        it('should accept absolute path for config', function* () {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);
        });

        it('should display a readable error if the environment does not exist', function* () {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);

            try {
                yield run('comfy setall donotexist $PWD/test.json');
            } catch (error) {
                expect(error.message).toContain('Unable to find environment "donotexist"');
                return;
            }

            expect('This command should fail').toBe(false);
        });
    });

    describe('get', () => {
        it('should display a readable error if the environment does not exist', function* () {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            try {
                yield run('comfy get donotexist');
            } catch (error) {
                expect(error.message).toContain('Unable to find environment "donotexist"');
                return;
            }

            expect('This command should fail').toBe(false);
        });

        it('should be able to select a subset of the config', function* () {
            const config = {
                admin: 'Admin',
                password: 'S3cret!',
                nested: {
                    a: {
                        a: 3,
                        b: 4
                    },
                    b: 2
                }
            };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout: admin } = yield run('comfy get development admin');
            expect(admin.trim()).toBe('Admin');

            const { stdout: nested } = yield run('comfy get development nested.a');
            expect(JSON.parse(nested)).toEqual({
                a: 3,
                b: 4
            });

            const { stdout: nestedValue } = yield run('comfy get development nested.a.b');
            expect(nestedValue.trim()).toBe('4');

            const { stdout: envvars } = yield run('comfy get development nested.a --envvars');
            expect(envvars.trim()).toBe("export NESTED_A_A='3';\nexport NESTED_A_B='4';");
        });

        it('should get config with hash name', function* () {
            const configV1 = { version: '1', login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(configV1)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout } = yield run('comfy log development');

            const lines = stdout.trim().split('\n');
            const [dateStr, environment, configurationSha, tags] = lines[0].split('\t');

            const configV2 = { version: '2', login: 'super-admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(configV2)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout: version } = yield run(`comfy get development --hash=${configurationSha} version`);

            expect(version).toBe(1);
        });
    });

    describe('set', () => {
        it('should change the value of a direct entry of the config', function* () {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout: originalStdout } = yield run('comfy get development');
            expect(JSON.parse(originalStdout)).toEqual(config);

            yield run('comfy set development login user');

            const expectedConfig = { login: 'user', password: 'S3cret' };
            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(expectedConfig);
        });

        it('should change the value of a subset of the config', function* () {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout: originalStdout } = yield run('comfy get development');
            expect(JSON.parse(originalStdout)).toEqual(config);

            yield run('comfy set development nested.test yolo');

            const expectedConfig = { login: 'admin', password: 'S3cret', nested: { test: 'yolo' } };
            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(expectedConfig);
        });

        it('should display a readable error if the environment does not exist', function* () {
            try {
                yield run('comfy set donotexist login user');
            } catch (error) {
                expect(error.message).toContain('Unable to find environment "donotexist"');
                return;
            }

            expect('This command should fail').toBe(false);
        });
    });

    describe('project', () => {
        it('should allow to permanently delete the current project', function* () {
            const { stdout: warning } = yield run('comfy project delete');
            expect(warning).toContain('This action is irreversible');

            const { stdout: currentConfig } = yield run('comfy get development');
            expect(JSON.parse(currentConfig)).toEqual({});

            const { stdout: projectId } = yield run('cat .comfy/config | grep projectId | sed "s/projectId=//"');

            const { stdout: confirmation } = yield run(`comfy project delete --permanently --id=${projectId}`);
            expect(confirmation).toContain('successfully deleted');

            try {
                yield run('comfy get development');
            } catch (error) {
                expect(error.message).toContain('Unable to locate the project identifier');
                return;
            }

            expect('The last command should not work').toBe(false);
        });
    });
});
