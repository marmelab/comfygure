import hash from 'object-hash';

import entriesQueries from '../../queries/entries';
import versionsQueries from '../../queries/versions';
import tagsQueries from '../../queries/tags';
import { get as getVersion } from './version';

export default async (projectId, environmentName, configName, entries, tagName = 'next') => {
    const { version: lastVersion, tag: lastTag } = await getVersion(projectId, environmentName, configName, tagName);

    const versionHash = hash({
        previous: lastVersion.hash,
        entries,
    });

    const version = await versionsQueries.insertOne({
        hash: versionHash,
        previous: lastVersion.hash,
    });

    await tagsQueries.updateOne(lastTag.id, {
        version_id: version.id,
    });

    await Object.keys(entries).map(key => entriesQueries.insertOne({
        key,
        value: entries[key],
        version_id: version.id,
    }));
};
