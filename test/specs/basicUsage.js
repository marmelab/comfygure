const expect = require('expect');
const { run, createProject } = require('../cli');

describe('Basic Usages', () => {
    beforeEach(createProject);

    describe('accessors', () => {
        it('should be able to add and read a basic JSON file', function* () {
            const config = { login: 'admin', password: 'S3cret' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);
        });

        it('should retrieve the latest version by default', function* () {
            const config = { login: 'admin', password: 'S3cret' };
            const latestConfig = { login: 'admin' };

            yield run(`echo '${JSON.stringify(config)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);

            yield run(`echo '${JSON.stringify(latestConfig)}' > test.json`);
            yield run('comfy setall development test.json');

            const { stdout: latestStdout } = yield run('comfy get development');
            expect(JSON.parse(latestStdout)).toEqual(latestConfig);
        });

        it('should keep the default format of guessed by the file extension', function* () {
            const config = 'login: admin';

            yield run(`echo '${config}' > test.yml`);
            yield run('comfy setall development test.yml');

            const { stdout } = yield run('comfy get development');
            expect(stdout.trim()).toEqual(config);
        });
    });

    describe('environments', () => {
        it('should be able to list environments', function* () {
            const { stdout } = yield run('comfy env ls');

            expect(stdout).toContain('development');
        });

        it('should be able to create an environment', function* () {
            yield run('comfy env add production');
            const { stdout } = yield run('comfy env ls');

            expect(stdout).toContain('development');
            expect(stdout).toContain('production');
        });
    });

    describe('log', () => {
        it('should be able to list all config versions for a given environment', function* () {
            const { stdout } = yield run('comfy log development');

            const lines = stdout.trim().split('\n');
            const [environment, configurationSha, tags] = lines[0].split('\t');

            expect(lines.length).toBe(1);
            expect(environment).toBe('development');
            expect(configurationSha.length).toBe(40);
            expect(tags).toContain('stable, next');
        });
    });
});
