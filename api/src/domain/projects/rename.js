import projectQueries from '../../queries/projects';

export default async (id, name) =>
    projectQueries.updateOne(id, {
        name,
    });
