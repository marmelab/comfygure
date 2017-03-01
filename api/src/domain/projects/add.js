import { LIVE } from '../common/states';
import projectsQueries from '../../queries/projects';
import addEnvironment from '../environments/add';

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

export default function* (name, environmentName = null) {
    console.log(name, environmentName);
    const project = yield projectsQueries.insertOne({
        name,
        state: LIVE,
        access_key: generateRandomString(20, true),
        read_token: generateRandomString(40),
        write_token: generateRandomString(40),
    });

    if (environmentName) {
        yield addEnvironment(project.id, environmentName);
    }

    return project;
}
