import hash from 'object-hash';

import entriesQueries from '../../queries/entries';
import versionsQueries from '../../queries/versions';
import configurationsQueries from '../../queries/configurations';
import tagsQueries from '../../queries/tags';
import environmentsQueries from '../../queries/environments';
import { ENVVARS } from '../common/formats';
import { get as getVersion } from './version';

export default async (projectId, environmentName, configurationName = 'default', tagName = '', entries = {}) => {
    let configuration = await configurationsQueries.findOne(projectId, environmentName, configurationName);

    if (!configuration) {
        const environment = await environmentsQueries.findOne(projectId, environmentName);

        configuration = await configurationsQueries.insertOne({
            environment_id: environment.id,
            name: configurationName,
            default_format: ENVVARS,
        });
    }

    const {
        tag: currentTag,
        version: currentVersion,
    } = await getVersion(projectId, environmentName, configurationName, tagName);

    const versionHash = hash({
        previous: currentVersion ? currentVersion.hash : null,
        entries,
    });

    const version = await versionsQueries.insertOne({
        hash: versionHash,
        configuration_id: configuration.id,
    });

    if (!currentTag) {
        const tag = {
            version_id: version.id,
            configuration_id: configuration.id,
        };

        await tagsQueries.batchInsert([
            {
                ...tag,
                name: 'stable',
            },
            {
                ...tag,
                name: 'next',
            },
        ]);
    } else {
        await tagsQueries.updateOne(currentTag, {
            version_id: version.id,
        });
    }

    await Object.keys(entries).map(key => entriesQueries.insertOne({
        key,
        value: entries[key],
        version_id: version.id,
    }));

    const { id, name, default_format: defaultFormat } = configuration;

    return {
        id,
        name,
        defaultFormat,
    };
};
