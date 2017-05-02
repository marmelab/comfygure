module.exports = (client, ui) => {
    const add = function* (project, environment, configName, name, selector) {
        const url = `${project.origin}/projects/${project.id}/environments/${environment}/configurations/${configName}/tags`;
        const body = {
            name,
            selector,
        };

        try {
            return yield client.post(url, body, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    const move = function* (project, environment, configName, name, selector) {
        const url = `${project.origin}/projects/${project.id}/environments/${environment}/configurations/${configName}/tags/${name}`;
        const body = { selector };

        try {
            return yield client.put(url, body, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    const remove = function* (project, environment, configName, name) {
        const url = `${project.origin}/projects/${project.id}/environments/${environment}/configurations/${configName}/tags/${name}`;

        try {
            return yield client.delete(url, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    return { add, move, remove };
};
