import React, { Component } from 'react';
import PropTypes from 'proptypes';
import JSONTree from 'react-json-tree';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';

import { injectState } from 'freactal';
import LinearProgress from 'material-ui/LinearProgress';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import provideConfigState from './provideConfigState';
import Alert from './components/Alert';

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

const treeTheme = {
    scheme: 'google',
    author: 'seth wright (http://sethawright.com)',
    base00: '#1d1f21',
    base01: '#282a2e',
    base02: '#373b41',
    base03: '#969896',
    base04: '#b4b7b4',
    base05: '#c5c8c6',
    base06: '#e0e0e0',
    base07: '#ffffff',
    base08: '#CC342B',
    base09: '#F96A38',
    base0A: '#FBA922',
    base0B: '#198844',
    base0C: '#3971ED',
    base0D: '#3971ED',
    base0E: '#A36AC7',
    base0F: '#3971ED',
};

const aceOptions = {
    showLineNumbers: true,
    tabSize: 4,
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

    handleSaveClick = () => {
        this.props.saveConfig(this.props.newConfig);
    };

    render() {
        const { config, edition, error, loading, newConfig, setNewConfig, toggleEdition } = this.props;

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
                        <JSONTree hideRoot theme={treeTheme} data={config} />
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
    config: PropTypes.object,
    edition: PropTypes.bool.isRequired,
    environmentName: PropTypes.string,
    error: PropTypes.string,
    getConfig: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    newConfig: PropTypes.object,
    saveConfig: PropTypes.func.isRequired,
    setNewConfig: PropTypes.func.isRequired,
    toggleEdition: PropTypes.func.isRequired,
};

Environment.defaultProps = {
    loading: false,
};

export default provideConfigState(
    injectState(
        ({
            state: { config, edition, environmentName, error, loading, newConfig, projectId, secret, token },
            effects: { getConfig, saveConfig, setNewConfig, toggleEdition },
        }) => (
            <Environment
                config={config}
                edition={edition}
                environmentName={environmentName}
                error={error}
                getConfig={environmentName => getConfig({ environmentName, projectId, secret, token })}
                loading={loading}
                newConfig={newConfig}
                saveConfig={config => saveConfig({ config, environmentName, projectId, secret, token })}
                setNewConfig={setNewConfig}
                toggleEdition={toggleEdition}
            />
        ),
    ),
);
