import React, { Component } from 'react';
import PropTypes from 'proptypes';
import JsonView from 'react-pretty-json';
import { injectState } from 'freactal';
import LinearProgress from 'material-ui/LinearProgress';
import provideConfigState from './provideConfigState';

const styles = {
    container: {
        padding: '1em',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
    },
};

class Environment extends Component {
    componentWillMount() {
        this.props.getConfig();
    }

    render() {
        const { config, error, loading } = this.props;

        return (
            <div style={styles.container}>
                {loading && <LinearProgress mode="indeterminate" />}
                {!loading && !config && <div>{error}</div>}
                {!loading && config && <JsonView json={config} spaces={4} />}
            </div>
        );
    }
}

Environment.propTypes = {
    config: PropTypes.object,
    error: PropTypes.string,
    getConfig: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default provideConfigState(
    injectState(({ state: { config, error, loading }, effects: { getConfig } }) => (
        <Environment config={config} error={error} loading={loading} getConfig={getConfig} />
    )),
);
