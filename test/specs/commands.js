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
                expect(error.message).toContain('Unable to found environment "donotexist"');
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
                expect(error.message).toContain('Unable to found environment "donotexist"');
                return;
            }

            expect('This command should fail').toBe(false);
        });
    });
});
