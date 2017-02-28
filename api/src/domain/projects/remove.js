import projectsQueries from '../../queries/projects';
import { ARCHIVED } from '../common/states';

export default function* (id) {
    return yield projectsQueries.updateOne(id, {
        state: ARCHIVED,
    });
}
