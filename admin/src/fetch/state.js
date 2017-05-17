import { softUpdate } from 'freactal';

export default {
    state: {
        error: null,
        loading: false,
    },
    effects: {
        setLoading: softUpdate((state, loading) => ({ loading })),
        setError: softUpdate((state, error) => ({ error })),
    },
};
