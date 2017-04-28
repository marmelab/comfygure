import { LIVE } from '../common/states';
import projectsQueries from '../../queries/projects';
import { add as addEnvironment } from '../environments';

const generateRandomString = (size, upperAlphaOnly = false) => {
    const numeric = '0123456789';
    const lowerAlpha = 'abcdefghijklmnopqrstuvwxyz';
    const upperAlpha = lowerAlpha.toUpperCase();

    const source = upperAlphaOnly ? upperAlpha : numeric + lowerAlpha + upperAlpha;

    let randomlyGeneratedString = '';

    while (randomlyGeneratedString.length < size) {
        const randomIndex = Math.floor(Math.random() * (source.length - 1));
        randomlyGeneratedString += source[randomIndex];
    }

    return randomlyGeneratedString;
};

export default async (name, environmentName = 'default', configurationName = 'default') => {
    const project = await projectsQueries.insertOne({
        name,
        state: LIVE,
        access_key: generateRandomString(20, true),
        read_token: generateRandomString(40),
        write_token: generateRandomString(40),
    });

    const environment = await addEnvironment(project.id, environmentName, configurationName);

    return {
        ...project,
        environments: [environment],
    };
};
