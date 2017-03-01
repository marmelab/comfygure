import db from './db';

const findOne = async (projectId, environmentName, configurationName) => {
    const project = db.projects.find(p => p.id === projectId);
    const environment = db.environments.find(e =>
        e.name === environmentName &&
        e.project_id === project.id,
    );
    const configuration = db.configurations.find(c =>
        c.name === configurationName &&
        c.environment_id === environment.id,
    );
    return configuration;
};

export default {
    findOne,
};
