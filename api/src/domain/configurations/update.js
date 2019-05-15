import hash from 'object-hash';

import entriesQueries from '../../queries/entries';
import versionsQueries from '../../queries/versions';
import configurationsQueries from '../../queries/configurations';
import tagsQueries from '../../queries/tags';
import { get as getVersion } from './version';

export default async (configurationId, tagName = 'latest') => {
    const configuration = await configurationsQueries.findOne(configurationId);

    if (!configuration) {
        return null;
    }

    const lastVersion = await getVersion(configurationId, tagName);

    const versionHash = hash({
        previous: lastVersion.hash,
        entries
    });

    const version = await versionsQueries.insertOne({
        hash: versionHash,
        previous: lastVersion.hash
    });

    await tagsQueries.updateOne(lastTag.id, {
        version_id: version.id
    });

    await Object.keys(entries).map(key =>
        entriesQueries.insertOne({
            key,
            value: entries[key],
            version_id: version.id
        })
    );
};
