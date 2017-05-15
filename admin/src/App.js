import React from 'react';
import { jsonServerRestClient, fetchUtils, Admin, Resource } from 'admin-on-rest';
import { EnvironmentsList } from './environments';
import { idProject, token } from './config.json';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json', 'Access-Control-Request-Method' : 'GET', 'Access-Control-Request-Headers': 'X-Total-Count' });
    }
    options.headers.set('Authorization',`Token ${token}`);
    return fetchUtils.fetchJson(url, options);
}

const restClient = jsonServerRestClient(`http://localhost:3000/projects/${idProject}`, httpClient);

const App = () => (
    <Admin restClient={restClient}>
        <Resource name="environments" list={EnvironmentsList}/>
    </Admin>
);

export default App;