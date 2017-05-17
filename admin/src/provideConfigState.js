import { provideState, softUpdate } from 'freactal';
import sg from 'sg.js';
import call from 'sg.js/dist/effects/call';

export const parseResponse = response => {
    if (response.status === 404 || response.status === 204) {
        return null;
    }
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    }

    return response.json().then(
        json => {
            const error = new Error(json.error);
            error.response = response;
            error.code = response.status;
            throw error;
        },
        () => {
            const error = new Error(response.statusText);
            error.response = response;
            error.code = response.status;
            throw error;
        },
    );
};

export const fetchConfig = (projectId, environmentName, configName = 'default') => {
    const request = new Request(
        `http://localhost:3000/projects/${projectId}/environments/${environmentName}/configurations/${configName}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Token ${state.token}`,
            },
        },
    );

    return fetch(request).then(parseResponse);
};

export const getConfigSaga = effects =>
    function*(state) {
        try {
            // Store a reference to the environment name here as state is mutated later (don't know why)
            const environmentName = state.environment.name;
            const projectId = state.projectId;
            const configName = state.configName;

            yield call(effects.setLoading, true);
            const config = yield call(fetchConfig, projectId, environmentName, configName);
            yield call(effects.setLoading, false);

            if (config) {
                yield call(effects.setConfig, config);
            } else {
                yield call(effects.setError, 'Not found');
            }
        } catch (error) {
            yield call(effects.setLoading, false);
            yield call(effects.setError, error.message);
        }
    };

export const effects = {
    setLoading: softUpdate((state, loading) => ({ loading })),
    setConfig: softUpdate((state, config) => ({ config })),
    setError: softUpdate((state, error) => ({ error })),
    getConfig: effects => sg(getConfigSaga(effects)),
};

export const state = {
    initialState: ({ environment }) => ({
        config: null,
        error: null,
        environment,
        loading: false,
    }),
    effects,
};

export default provideState(state);
