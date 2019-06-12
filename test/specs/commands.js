const expect = require('expect');
const { run, createProject } = require('../cli');

describe('Commands', () => {
    beforeEach(createProject);

    describe('setall', () => {
        it('should accept relative path for config', function*() {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);
        });

        it('should accept absolute path for config', function*() {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);
        });

        it('should display a readable error if the environment does not exist', function*() {
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
        it('should display a readable error if the environment does not exist', function*() {
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

        it('should be able to select a subset of the config', function*() {
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

        it('should be able to select a subset of the config with an uppercase selector', function*() {
            const config = {
                version: 3,
                id: 'id',
                address: 'address',
                Crypto: {
                    ciphertext: 'ciphertext',
                    cipherparams: { iv: 'iv' },
                    cipher: 'cipher'
                }
            };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout: cipher } = yield run('comfy get development Crypto.cipher');
            expect(cipher).toBe('cipher\n');
        });

        it('should get config with hash name', function*() {
            const configV1 = { version: '1', login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(configV1)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout } = yield run('comfy log development');

            const lines = stdout.trim().split('\n');
            const [dateStr, environment, configurationSha, tags] = lines[0].split('\t');

            const configV2 = { version: '2', login: 'super-admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(configV2)}' > test.json`);
            yield run('comfy setall development $PWD/test.json');

            const { stdout: version } = yield run(
                `comfy get development --hash=${configurationSha} version`
            );

            expect(version).toContain('1');
        });
    });

    describe('set', () => {
        it('should change the value of a direct entry of the config', function*() {
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

        it('should change the value of a subset of the config', function*() {
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

        it('should display a readable error if the environment does not exist', function*() {
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
        it('should allow to permanently delete the current project', function*() {
            const { stdout: warning } = yield run('comfy project delete');
            expect(warning).toContain('This action is irreversible');

            const { stdout: currentConfig } = yield run('comfy get development');
            expect(JSON.parse(currentConfig)).toEqual({});

            const { stdout: projectId } = yield run(
                'cat .comfy/config | grep projectId | sed "s/projectId=//"'
            );

            const { stdout: confirmation } = yield run(
                `comfy project delete --permanently --id=${projectId}`
            );
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

    const parseHash = line => line.split('\t')[2];

    describe('tag', () => {
        it('should allow to list tags', function*() {
            const { stdout } = yield run('comfy tag list development');

            expect(stdout).toContain('latest');
        });

        it('should allow to create a new tag', function*() {
            const { stdout: log } = yield run('comfy tag list development');
            const hash = parseHash(log);

            const { stdout: success } = yield run(`comfy tag add development newtag ${hash}`);
            expect(success).toContain('Tag successfully created');

            const { stdout } = yield run('comfy tag list development');
            expect(stdout).toContain(`${hash}\tlatest, newtag`);
        });

        it('should allow to move an existing tag', function*() {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout: log } = yield run('comfy log development');
            const [firstHash, secondHash] = log.split('\n').map(parseHash);

            yield run(`comfy tag add development newtag ${firstHash}`);
            const { stdout: addedTag } = yield run('comfy tag list development');
            expect(addedTag).toContain(`${firstHash}\tlatest, newtag`);

            const { stdout: success } = yield run(
                `comfy tag move development newtag ${secondHash}`
            );
            expect(success).toContain('Tag successfully moved');

            const { stdout: movedTag } = yield run('comfy tag list development');
            expect(movedTag).toContain(`${firstHash}\tlatest`);
            expect(movedTag).toContain(`${secondHash}\tnewtag`);
        });

        it('should not allow to move the `latest` tag', function*() {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout: log } = yield run('comfy log development');
            const [firstHash, secondHash] = log.split('\n').map(parseHash);
            expect(log).toContain(`${firstHash}\tlatest`);

            try {
                yield run(`comfy tag move development latest ${secondHash}`);
                fail();
            } catch (error) {
                /* expected to fail */
            }

            const { stdout } = yield run('comfy tag list development');
            expect(stdout).toContain(`${firstHash}\tlatest`);
        });

        it('should allow to delete a tag', function*() {
            const { stdout: log } = yield run('comfy tag list development');
            const hash = parseHash(log);

            const { stdout: success } = yield run(`comfy tag add development newtag ${hash}`);
            expect(success).toContain('Tag successfully created');

            const { stdout: newTag } = yield run('comfy tag list development');
            expect(newTag).toContain(`${hash}\tlatest, newtag`);

            const { stdout: deletedTag } = yield run('comfy tag delete development newtag');
            expect(deletedTag).toContain('Tag successfully deleted');

            const { stdout } = yield run('comfy tag list development');
            expect(stdout).toContain(`${hash}\tlatest`);
            expect(stdout).not.toContain(`${hash}\tlatest, newtag`);
        });

        it('should not allow to delete the `latest` tag', function*() {
            const { stdout: log } = yield run('comfy tag list development');
            const hash = parseHash(log);
            expect(log).toContain(`${hash}\tlatest`);

            try {
                yield run('comfy tag delete development latest');
                fail();
            } catch (error) {
                /* expected to fail */
            }

            const { stdout } = yield run('comfy tag list development');
            expect(stdout).toContain(`${hash}\tlatest`);
        });
    });

    describe('diff', () => {
        it('should display a git-like diff between two configuration versions', function*() {
            yield run(`echo '${JSON.stringify({ login: 'admin', password: 'S3cret' })}' > test.json`);
            yield run('comfy setall development test.json');
            yield run('comfy set development login user')

            const { stdout, stderr } = yield run('comfy get development login');
            expect(stdout).toEqual('user\n');

            const { stdout: history } = yield run('comfy log development');

            const lines = history.trim().split('\n');
            const [dateStr, environment, hash] = lines[1].split('\t');

            const { stdout: diff } = yield run(`comfy diff development ${hash}`);
            expect(diff).toContain('-    "login": "admin",');
            expect(diff).toContain('+    "login": "user",');
        });
    })
});
