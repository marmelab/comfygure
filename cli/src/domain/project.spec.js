const projectFactory = require('./project');
const { CREDENTIALS_VARIABLE } = require('./constants');

const client = null;
const ui = {
    colors: { red: jest.fn(), bold: jest.fn() },
    error: jest.fn(),
    exit: jest.fn(),
};

describe('Project Domain', () => {
    const credentials = {
        id: 'id',
        accessKey: 'accessKey',
        secretToken: 'secretToken',
        privateKey: 'privateKey',
        hmacKey: 'hmacKey',
        origin: 'origin',
    };

    const removeCredentialsFromEnvironment = () => {
        delete process.env.COMFY_PROJECT_ID;
        delete process.env.COMFY_ACCESS_KEY;
        delete process.env.COMFY_SECRET_TOKEN;
        delete process.env.COMFY_PRIVATE_KEY;
        delete process.env.COMFY_HMAC_KEY;
        delete process.env.COMFY_ORIGIN;
    };

    beforeEach(() => {
        process.env.COMFY_PROJECT_ID = credentials.id;
        process.env.COMFY_ACCESS_KEY = credentials.accessKey;
        process.env.COMFY_SECRET_TOKEN = credentials.secretToken;
        process.env.COMFY_PRIVATE_KEY = credentials.privateKey;
        process.env.COMFY_HMAC_KEY = credentials.hmacKey;
        process.env.COMFY_ORIGIN = credentials.origin;
    });

    it('should build an hex encoded string with existing credentials', () => {
        const project = projectFactory(client, ui);
        const encodedCredentials = project.toEncodedCredentials();

        expect(encodedCredentials).toBe(
            'eyJpZCI6ImlkIiwiYWNjZXNzS2V5IjoiYWNjZXNzS2V5Iiwic2VjcmV0VG9rZW4iOiJzZWNyZXRUb2tlbiIsInByaXZhdGVLZXkiOiJwcml2YXRlS2V5IiwiaG1hY0tleSI6ImhtYWNLZXkiLCJvcmlnaW4iOiJvcmlnaW4ifQ=='
        );
    });

    it('should be able to restore a project configuration via an encoded credentials', () => {
        process.env[CREDENTIALS_VARIABLE] = projectFactory(client, ui).toEncodedCredentials();

        expect(projectFactory(client, ui).retrieveFromConfig()).toEqual(credentials);
    });

    afterEach(() => {
        removeCredentialsFromEnvironment();
        delete process.env[CREDENTIALS_VARIABLE];
    });
});
