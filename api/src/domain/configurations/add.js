import hash from 'object-hash';

import entriesQueries from '../../queries/entries';
import versionsQueries from '../../queries/versions';
import configurationsQueries from '../../queries/configurations';
import tagsQueries from '../../queries/tags';
import environmentsQueries from '../../queries/environments';
import { ENVVARS } from '../common/formats';
import { get as getVersion } from './version';

export default async (projectId, environmentName, configurationName = 'default', tagName = null, entries = {}) => {
    let configuration = await configurationsQueries.findOne(projectId, environmentName, configurationName);

    if (!configuration) {
        const environment = await environmentsQueries.findOne(projectId, environmentName);
        // TODO: If no environment found, return a usable error

        configuration = await configurationsQueries.insertOne({
            environment_id: environment.id,
            name: configurationName,
            default_format: ENVVARS,
        });
    }

    const currentVersion = await getVersion(projectId, environmentName, configurationName, tagName);

    const versionHash = hash({
        previous: currentVersion ? currentVersion.hash : null,
        entries,
    });
    // TODO: If the version hash already exist in DB
    // return a 304 to warn that the version already exists

    const version = await versionsQueries.insertOne({
        hash: versionHash,
        configuration_id: configuration.id,
        previous: currentVersion ? currentVersion.hash : null,
    });

    if (tagName) {
        const tag = await tagsQueries.findOne(configuration.id, tagName);

        if (tag) {
            await tagsQueries.updateOne(tag, {
                version_id: version.id,
            });
        } else {
            const newTag = {
                version_id: version.id,
                configuration_id: configuration.id,
            };

            await tagsQueries.batchInsert([
                { ...newTag, name: 'stable' },
                { ...newTag, name: 'next' },
            ]);
        }
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
