import React, { Component } from 'react';
import PropTypes from 'proptypes';
import JsonView from 'react-pretty-json';
import { injectState } from 'freactal';
import LinearProgress from 'material-ui/LinearProgress';

import provideConfigState from './provideConfigState';
import Alert from './components/Alert';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        padding: '1em',
    },
};

class Environment extends Component {
    componentWillMount() {
        this.props.getConfig(this.props.environmentName);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.environmentName !== this.props.environmentName) {
            this.props.getConfig(nextProps.environmentName);
        }
    }

    render() {
        const { config, error, loading } = this.props;

        return (
            <div style={styles.container}>
                {loading && <LinearProgress mode="indeterminate" />}
                {error && <Alert message={error} />}
                {!loading && config && <JsonView json={config} spaces={4} />}
            </div>
        );
    }
}

Environment.propTypes = {
    config: PropTypes.object,
    environmentName: PropTypes.string,
    error: PropTypes.string,
    getConfig: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

Environment.defaultProps = {
    loading: false,
};

export default provideConfigState(
    injectState(({ state: { config, error, loading, environmentName, token, projectId }, effects: { getConfig } }) => (
        <Environment
            environmentName={environmentName}
            config={config}
            error={error}
            loading={loading}
            getConfig={environmentName => getConfig({ environmentName, token, projectId })}
        />
    )),
);
