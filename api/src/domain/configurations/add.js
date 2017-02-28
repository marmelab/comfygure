import hash from 'object-hash';

import entriesQueries from '../../queries/entries';
import versionsQueries from '../../queries/versions';
import tagsQueries from '../../queries/tags';
import { get as getVersion } from './version';

export default function* (projectId, environmentName, configName, tagName = 'next') {
    const { version: lastVersion, tag: lastTag } = yield getVersion(projectId, environmentName, configName, tagName);

    const versionHash = hash({
        previous: lastVersion.hash,
        entries: this.event.body,
    });

    const version = yield versionsQueries.insertOne({
        hash: versionHash,
        previous: lastVersion.hash,
        date: new Date(),
    });

    yield tagsQueries.updateOne(lastTag.id, {
        version_id: version.id,
    });

    for (const key in this.event.body) {
        if (Object.prototype.hasOwnProperty.call(this.event.body, key)) {
            yield entriesQueries.insertOne({
                key,
                value: this.event.body[key],
                version_id: version.id,
            });
        }
    }
}
