import projectQueries from '../queries/projects';

const checkPermission = async (projectId, token, level) => {
    const project = await projectQueries.findFromIdAndToken(projectId, token);

    if (!project) {
        throw new Error('Project ID or token is invalid.');
    }

    let permissionIsValid;

    switch (level) {
    case 'write':
        permissionIsValid = token === project.writeToken;
        break;
    case 'read':
        permissionIsValid = [project.writeToken, project.readToken].includes(token);
        break;
    default:
        throw new Error(`Level "${level}" doesn't exists.`);
    }

    if (!permissionIsValid) {
        throw new Error("Your token doesn't allow you to perform this action.");
    }
};

export default { checkPermission };
