import hash from 'object-hash';

import entriesQueries from '../../queries/entries';
import versionsQueries from '../../queries/versions';
import configurationsQueries from '../../queries/configurations';
import environmentsQueries from '../../queries/environments';
import { ENVVARS } from '../common/formats';

import { get as getVersion } from './version';
import { add as addTag, get as getTag, update as updateTag } from './tag';
import { checkEnvironmentExistsOrThrow404 } from '../validation';

export default async (
    projectId,
    environmentName,
    configurationName = 'default',
    tagName = null,
    entries = {},
) => {
    await checkEnvironmentExistsOrThrow404(projectId, environmentName);

    let configuration = await configurationsQueries.findOne(
        projectId,
        environmentName,
        configurationName,
    );
    let configurationNewlyCreated = false;

    if (!configuration) {
        const environment = await environmentsQueries.findOne(projectId, environmentName);
        // TODO: If no environment found, return a usable error

        configuration = await configurationsQueries.insertOne({
            environment_id: environment.id,
            name: configurationName,
            default_format: ENVVARS,
        });

        configurationNewlyCreated = true;
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

    const newTagInfos = {
        versionId: version.id,
        configurationId: configuration.id,
    };

    if (configurationNewlyCreated) {
        await Promise.all([
            { ...newTagInfos, name: 'stable' },
            { ...newTagInfos, name: 'next' },
        ].map(tag => addTag(tag.configurationId, tag.versionId, tag.name)));
    }

    // Create or update the specified tag
    if (tagName) {
        const tag = await getTag(configuration.id, tagName);

        if (tag) {
            await updateTag(tag, { version_id: version.id });
        } else {
            await addTag(newTagInfos.configurationId, newTagInfos.versionId, tagName);
        }
    }

    await Promise.all(Object.keys(entries).map(key => entriesQueries.insertOne({
        key,
        value: entries[key],
        version_id: version.id,
    })));

    const { id, name, default_format: defaultFormat } = configuration;

    return {
        id,
        name,
        defaultFormat,
    };
};
