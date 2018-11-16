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
    });

    describe('project', () => {
        it('should allow to permanently delete the current project', function* () {
            const { stdout: warning } = yield run('comfy project delete');
            expect(warning).toContain('This action is irreversible');

            const { stdout: currentConfig } = yield run('comfy get development');
            expect(JSON.parse(currentConfig)).toEqual({});

            const {
                stdout: projectId,
            } = yield run('cat .comfy/config | grep projectId | sed "s/projectId=//"');

            const {
                stdout: confirmation,
            } = yield run(`comfy project delete --permanently --id=${projectId}`);
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
