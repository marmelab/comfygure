const expect = require('expect');
const yaml = require('js-yaml');
const { run, createProject } = require('../cli');

describe('Formats', () => {
    const config = { login: 'admin', password: 'S3cret' };

    beforeEach(createProject);

    beforeEach(function* () {
        yield run(`echo '${JSON.stringify(config)}' > test.json`);
        yield run('comfy setall development test.json');
    });

    describe('JSON', () => {
        it('should print valid JSON format', function* () {
            const { stdout } = yield run('comfy get development');

            expect(JSON.parse(stdout)).toEqual(config);
        });
    });

    describe('YAML', () => {
        it('it should print valid YAML format', function* () {
            const { stdout } = yield run('comfy get development --yml');

            expect(yaml.safeLoad(stdout)).toEqual(config);
        });
    });

    describe('Environment variables', () => {
        it('it should print valid env. vars format', function* () {
            const { stdout } = yield run('comfy get development --envvars');
            const [admin, secret] = stdout.split('\n');

            expect(admin).toBe("export LOGIN='admin';");
            expect(secret).toBe("export PASSWORD='S3cret';");
        });
    });
});
