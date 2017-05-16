import { provideState, softUpdate } from 'freactal';
import sg from 'sg.js';
import call from 'sg.js/dist/effects/call';

export const parseResponse = response => {
    if (response.status === 404 || response.status === 204) {
        return { error: 'Not found' };
    }
    if (response.status >= 200 && response.status < 300) {
        return { data: response.json() };
    }

    return response.json().then(
        json => {
            return { error: json.error };
        },
        () => {
            return { error: response.statusText };
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
        // Store a reference to the environment name here as state is mutated later (don't know why)
        const environmentName = state.environment.name;
        const projectId = state.projectId;
        const configName = state.configName;

        yield call(effects.setLoading, true);
        const fetchResult = yield call(fetchConfig, projectId, environmentName, configName);
        yield call(effects.setLoading, false);

        const newState = yield call(effects.setFetchResult, fetchResult);
        return newState;
    };

export const effects = {
    setLoading: softUpdate((state, loading) => ({ loading })),
    setFetchResult: softUpdate((state, { data, error }) => ({ config: data, error })),
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
