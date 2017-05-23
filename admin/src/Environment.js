import React, { Component } from 'react';
import PropTypes from 'proptypes';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';

import { injectState } from 'freactal';
import { List, ListItem } from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import provideConfigState from './provideConfigState';
import Alert from './components/Alert';
import EnvironmentItem from './components/EnvironmentItem';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        padding: '1em',
    },
    config: {
        paddingTop: '1em',
    },
};

const aceOptions = {
    showLineNumbers: true,
    tabSize: 4,
};

class Environment extends Component {
    componentWillMount() {
        this.props.loadConfig(this.props.state.environmentName);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.state.environmentName !== this.props.state.environmentName) {
            this.props.loadConfig(nextProps.state.environmentName);
        }
    }

    handleSaveClick = () => {
        this.props.saveConfig(this.props.state.newConfig);
    };

    render() {
        const {
            state: { config, edition, error, loading, newConfig },
            effects: { setNewConfig, toggleEdition },
        } = this.props;

        return (
            <div style={styles.container}>
                <Toolbar>
                    <ToolbarGroup firstChild>
                        {!edition && <RaisedButton label="Edit" primary onClick={toggleEdition} />}
                        {edition && <RaisedButton label="Save" primary onClick={this.handleSaveClick} />}
                        {edition && <RaisedButton label="Cancel" onClick={toggleEdition} />}
                    </ToolbarGroup>
                </Toolbar>
                {loading && <LinearProgress mode="indeterminate" />}
                {error && <Alert message={error} />}
                {!loading &&
                    config &&
                    !edition &&
                    <div style={styles.config}>
                        <List>
                            <ListItem disabled rightIconButton={<span>Unlock</span>} />
                            {Object.keys(config).map(key => (
                                <EnvironmentItem key={key} name={key} value={config[key]} />
                            ))}
                        </List>
                    </div>}
                {!loading &&
                    config &&
                    edition &&
                    <div style={styles.config}>
                        <AceEditor
                            mode="javascript"
                            theme="github"
                            name="configEditor"
                            showGutter
                            highlightActiveLine
                            value={JSON.stringify(newConfig, null, 4)}
                            setOptions={aceOptions}
                            onChange={setNewConfig}
                            width="100%"
                        />
                    </div>}
            </div>
        );
    }
}

Environment.propTypes = {
    state: PropTypes.shape({
        config: PropTypes.object,
        edition: PropTypes.bool.isRequired,
        environmentName: PropTypes.string,
        error: PropTypes.string,
        loading: PropTypes.bool,
        newConfig: PropTypes.object,
    }).isRequired,
    effects: PropTypes.shape({
        setNewConfig: PropTypes.func.isRequired,
        toggleEdition: PropTypes.func.isRequired,
    }).isRequired,
    saveConfig: PropTypes.func.isRequired,
    loadConfig: PropTypes.func.isRequired,
};

Environment.defaultProps = {
    loading: false,
};

const enhance = compose(
    provideConfigState,
    injectState,
    withHandlers({
        loadConfig: ({ state: { origin, projectId, passphrase, token }, effects: { loadConfig } }) => environmentName =>
            loadConfig({ environmentName, origin, projectId, passphrase, token }),
        saveConfig: ({
            state: { environmentName, origin, projectId, passphrase, token },
            effects: { saveConfig },
        }) => config => saveConfig({ config, environmentName, origin, projectId, passphrase, token }),
    }),
);

export default enhance(Environment);
