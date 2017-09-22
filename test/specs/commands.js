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
    });
});
