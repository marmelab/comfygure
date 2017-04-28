module.exports = (client, ui) => {
    const list = function* (project) {
        const url = `${project.origin}/projects/${project.id}/environments`;

        try {
            return yield client.get(url, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    const add = function* (project, environmentName) {
        const url = `${project.origin}/projects/${project.id}/environments`;
        const data = { name: environmentName };

        try {
            return yield client.post(url, data, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    return { list, add };
};
