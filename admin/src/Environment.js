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
import { Card, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import provideConfigState from './provideConfigState';
import Alert from './components/Alert';
import RemoveConfigKeyDialog from './components/RemoveConfigKeyDialog';
import ConfigKeyEditionDialog from './components/ConfigKeyEditionDialog';
import EnvironmentItem from './components/EnvironmentItem';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        padding: '1em',
        backgroundColor: 'rgb(232, 232, 232)',
    },
    card: {
        position: 'relative',
    },
    addButton: {
        position: 'absolute',
        bottom: -28,
        right: 0,
    },
};

const aceOptions = {
    showLineNumbers: true,
    tabSize: 4,
};

class Environment extends Component {
    static propTypes = {
        state: PropTypes.shape({
            config: PropTypes.object,
            edition: PropTypes.bool.isRequired,
            environmentName: PropTypes.string,
            error: PropTypes.string,
            keyToRemove: PropTypes.string,
            loading: PropTypes.bool,
            newConfig: PropTypes.object,
        }).isRequired,
        effects: PropTypes.shape({
            setNewConfig: PropTypes.func.isRequired,
            toggleEdition: PropTypes.func.isRequired,
        }).isRequired,
        loadConfig: PropTypes.func.isRequired,
        saveConfig: PropTypes.func.isRequired,
        updateConfigKey: PropTypes.func.isRequired,
    };

    static defaultProps = {
        loading: false,
    };

    state = { keyToEdit: null };

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

    handleEdit = key => {
        this.setState({ keyToEdit: key });
    };

    handleEditCancel = () => {
        this.setState({ keyToEdit: undefined });
    };

    handleEditSave = newKey => {
        this.props.updateConfigKey(newKey);
        this.setState({ keyToEdit: undefined });
    };

    render() {
        const {
            state: { config, edition, error, loading, newConfig },
            effects: { requestToRemoveKey, setNewConfig, toggleEdition },
        } = this.props;

        const { keyToEdit } = this.state;

        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <CardText>
                        {!edition && <RaisedButton label="Edit" primary onClick={toggleEdition} />}
                        {edition && <RaisedButton label="Save" primary onClick={this.handleSaveClick} />}
                        {edition && <RaisedButton label="Cancel" onClick={toggleEdition} />}
                    </CardText>
                    <Divider />
                    {loading && <LinearProgress mode="indeterminate" />}
                    {error && <Alert message={error} />}
                    {!loading &&
                        config &&
                        !edition &&
                        <CardText>
                            <List>
                                <ListItem disabled rightIconButton={<span>Unlock</span>} />
                                {Object.keys(config).map(key => (
                                    <EnvironmentItem
                                        key={key}
                                        name={key}
                                        value={config[key]}
                                        onRemove={requestToRemoveKey}
                                        onEdit={this.handleEdit}
                                    />
                                ))}
                            </List>
                        </CardText>}
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
                    <FloatingActionButton style={styles.addButton}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Card>
                <RemoveConfigKeyDialog />

                <ConfigKeyEditionDialog
                    onCancel={this.handleEditCancel}
                    onSave={this.handleEditSave}
                    open={!!keyToEdit}
                    configKey={keyToEdit}
                />
            </div>
        );
    }
}

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
        updateConfigKey: ({
            state: { config, environmentName, origin, projectId, passphrase, token },
            effects: { updateConfigKey },
        }) => key => updateConfigKey({ config, environmentName, key, origin, projectId, passphrase, token }),
    }),
);

export default enhance(Environment);
