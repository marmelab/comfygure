import projectsQueries from '../../queries/projects';

export default function* (id, name) {
    console.log('renameProject', id, name);
    return yield projectsQueries.updateOne(id, {
        name,
    });
}
