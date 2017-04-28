import { get as getVersion } from '../configurations/version';
import tagsQueries from '../../queries/tags';
import validateTag from './validator';

export default async (projectId, environmentName, configName, selector, rawName) => {
    const name = rawName.toLowerCase();
    validateTag(name);

    const version = await getVersion(projectId, environmentName, configName, selector);
    if (!version) {
        throw new Error(`No configuration found for selector "${selector}"`);
    }

    return tagsQueries.insertOne({
        configuration_id: version.configuration_id,
        version_id: version.id,
        name,
    });
};
