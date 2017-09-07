const expect = require('expect');
const { run, createProject } = require('../cli');

describe('Child Entries', () => {
    beforeEach(createProject);

    it('should be able to delete a child entry with a new configuration', function* () {
        const firstConfig = {
            parent: { entry: 'entryToDelete' },
        };

        yield run(`echo '${JSON.stringify(firstConfig)}' > firstConfig.json`);
        yield run('comfy setall development firstConfig.json');

        const { stdout: firstConfigOutput } = yield run('comfy get development');
        expect(JSON.parse(firstConfigOutput)).toEqual(firstConfig);

        const secondConfig = {
            parent: { child: { entry: 'entry' } },
            child: { entry: 'entry' },
        };

        yield run(`echo '${JSON.stringify(secondConfig)}' > secondConfig.json`);
        yield run('comfy setall development secondConfig.json');

        const { stdout: secondConfigOutput } = yield run('comfy get development');
        expect(JSON.parse(secondConfigOutput)).toEqual(secondConfig);
    });
});
