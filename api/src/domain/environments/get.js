import environmentsQueries from '../../queries/environments';

export default function* (projectId) {
    return yield environmentsQueries.select({
        project_id: projectId,
    });
}
