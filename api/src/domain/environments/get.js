import environmentsQueries from '../../queries/environments';

export default async projectId => environmentsQueries.selectByProject(projectId);
