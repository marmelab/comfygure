import projectsQueries from '../../queries/projects';
import { ARCHIVED } from '../common/states';

export default async id => projectsQueries.updateOne(id, {
    state: ARCHIVED,
});
