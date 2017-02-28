import projectsQueries from '../../queries/projects';
import { LIVE } from '../common/states';

export default function* (name) {
    return yield projectsQueries.insertOne({
        name,
        state: LIVE,
    });
}
