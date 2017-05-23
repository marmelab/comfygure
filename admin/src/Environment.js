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
import TextField from 'material-ui/TextField';

import provideConfigState from './provideConfigState';
import Alert from './components/Alert';
import ConfigKeyRemoveDialog from './components/ConfigKeyRemoveDialog';
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
<<<<<<< HEAD
    card: {
        position: 'relative',
    },
    addButton: {
        position: 'absolute',
        bottom: -28,
        right: 0,
=======
    actions: {
        display: 'flex',
    },
    search: {
        marginLeft: 'auto',
>>>>>>> better style for search input
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
<<<<<<< HEAD
        saveConfig: PropTypes.func.isRequired,
=======
        setSearch: PropTypes.func.isRequired,
>>>>>>> better style for search input
    };

    static defaultProps = {
        loading: false,
    };

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
            state: { edition, error, loading, newConfig, filteredConfig },
            effects: { requestToEditKey, requestToRemoveKey, setNewConfig, toggleEdition },
            setSearch,
        } = this.props;

        return (
            <div style={styles.container}>
                <Card>
                    <CardText>
                        {edition &&
                            <div>
                                <RaisedButton label="Save" primary onClick={this.handleSaveClick} />
                                <RaisedButton label="Cancel" onClick={toggleEdition} />
                            </div>}
                        {!edition &&
                            <div style={styles.actions}>
                                <TextField hintText="search" onChange={setSearch} />
                                <div style={styles.search}>
                                    <RaisedButton label="Edit" primary onClick={toggleEdition} />
                                </div>
                            </div>}
                    </CardText>
                    <Divider />
                    {loading && <LinearProgress mode="indeterminate" />}
                    {error && <Alert message={error} />}
                    {!loading &&
                        filteredConfig &&
                        !edition &&
                        <CardText>
                            <List>
                                <ListItem disabled rightIconButton={<span>Unlock</span>} />
                                {Object.keys(filteredConfig).map(key => (
                                    <EnvironmentItem
                                        key={key}
                                        name={key}
                                        value={filteredConfig[key]}
                                        onRemove={requestToRemoveKey}
                                        onEdit={requestToEditKey}
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

                <ConfigKeyRemoveDialog />
                <ConfigKeyEditionDialog />
            </div>
        );
    }
}

const enhance = compose(
    provideConfigState,
    injectState,
    withHandlers({
        setSearch: ({ effects: { setSearch } }) => (event, value) => setSearch(value),
        loadConfig: ({ state: { origin, projectId, passphrase, token }, effects: { loadConfig } }) => environmentName =>
            loadConfig({ environmentName, origin, projectId, passphrase, token }),
        saveConfig: ({
            state: { environmentName, origin, projectId, passphrase, token },
            effects: { saveConfig },
        }) => config => saveConfig({ config, environmentName, origin, projectId, passphrase, token }),
    }),
);

export default enhance(Environment);
