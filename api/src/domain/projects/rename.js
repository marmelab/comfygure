import projectsQueries from '../../queries/projects';

export default function* (id, name) {
    return yield projectsQueries.updateOne(id, {
        name,
    });
}
