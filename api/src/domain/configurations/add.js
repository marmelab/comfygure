import hash from 'object-hash';

import entriesQueries from '../../queries/entries';
import versionsQueries from '../../queries/versions';
import configurationsQueries from '../../queries/configurations';
import { ENVVARS } from '../common/formats';

import { get as getVersion } from './version';
import { add as addTag, get as getTag, update as updateTag } from './tag';
import { getProjectOr404 } from '../projects';
import { getEnvironmentOr404 } from '../environments';

export default async (
    projectId,
    environmentName,
    configurationName = 'default',
    tagName = null,
    entries = {},
    format = null,
) => {
    await getProjectOr404(projectId);
    const environment = await getEnvironmentOr404(projectId, environmentName);

    let configuration = await configurationsQueries.findOne(
        projectId,
        environmentName,
        configurationName,
    );
    let newlyCreated = false;

    if (!configuration) {
        configuration = await configurationsQueries.insertOne({
            environment_id: environment.id,
            name: configurationName,
            default_format: format || ENVVARS,
        });

        newlyCreated = true;
    }

    if (!newlyCreated && configuration.default_format !== format) {
        configuration = await configurationsQueries.updateOne(configuration.id, {
            ...configuration,
            default_format: format || ENVVARS,
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

    const newTagInfos = {
        versionId: version.id,
        configurationId: configuration.id,
    };

    if (newlyCreated) {
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
