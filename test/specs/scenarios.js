const expect = require('expect');
const { run, createProject } = require('../cli');

describe('Scenarios', () => {
    beforeEach(createProject);

    describe('Child Entries', () => {
        it('should be able to delete a child entry with a new configuration', function*() {
            const firstConfig = {
                parent: { entry: 'entryToDelete' }
            };

            yield run(`echo '${JSON.stringify(firstConfig)}' > firstConfig.json`);
            yield run('comfy setall development firstConfig.json');

            const { stdout: firstConfigOutput } = yield run('comfy get development');
            expect(JSON.parse(firstConfigOutput)).toEqual(firstConfig);

            const secondConfig = {
                parent: { child: { entry: 'entry' } },
                child: { entry: 'entry' }
            };

            yield run(`echo '${JSON.stringify(secondConfig)}' > secondConfig.json`);
            yield run('comfy setall development secondConfig.json');

            const { stdout: secondConfigOutput } = yield run('comfy get development');
            expect(JSON.parse(secondConfigOutput)).toEqual(secondConfig);
        });
    });

    describe('Serialization', () => {
        it('should not transform a `false` bool to a `"false"` string', function*() {
            const config = { myEntry: false };

            yield run(`echo '${JSON.stringify(config)}' > config.json`);
            yield run('comfy setall development config.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);
        });

        it('should not transform a `null` into something else', function*() {
            const config = { myEntry: null };

            yield run(`echo '${JSON.stringify(config)}' > config.json`);
            yield run('comfy setall development config.json');

            const { stdout } = yield run('comfy get development');
            expect(JSON.parse(stdout)).toEqual(config);
        });
    });
});
