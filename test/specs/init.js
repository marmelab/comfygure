const expect = require('expect');
const run = require('../cli').run;

describe('Project initialization', () => {
    it('should create a new project', function* () {
        const { stdout } = yield run("comfy init --origin 'http://localhost:3000'");

        expect(stdout).toContain('http://localhost:3000');
    });

    it('should create a new environment', function* () {
        yield run("comfy init --origin 'http://localhost:3000'");

        const { stdout } = yield run('comfy env ls');

        expect(stdout).toContain('development');
    });

    it('should add the origin to `.comfy/config`', function* () {
        yield run("comfy init --origin 'http://localhost:3000'");

        const { stdout } = yield run('cat .comfy/config');
        expect(stdout).toContain('http://localhost:3000');
    });

    it('should create project ID', function* () {
        yield run("comfy init --origin 'http://localhost:3000'");

        const { stdout } = yield run('cat .comfy/config');
        expect(stdout).toContain('projectId=');
    });

    it('should create access key', function* () {
        yield run("comfy init --origin 'http://localhost:3000'");

        const { stdout } = yield run('cat .comfy/config');
        expect(stdout).toContain('accessKey=');
    });

    it('should create secret token', function* () {
        yield run("comfy init --origin 'http://localhost:3000'");

        const { stdout } = yield run('cat .comfy/config');
        expect(stdout).toContain('secretToken=');
    });

    it('should create private key', function* () {
        yield run("comfy init --origin 'http://localhost:3000'");

        const { stdout } = yield run('cat .comfy/config');
        expect(stdout).toContain('privateKey=');
    });

    it('should create a HMAC signature key', function* () {
        yield run("comfy init --origin 'http://localhost:3000'");

        const { stdout } = yield run('cat .comfy/config');
        expect(stdout).toContain('hmacKey=');
    });
});
