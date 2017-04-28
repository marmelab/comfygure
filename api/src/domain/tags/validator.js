import slug from 'slug';

export default (name) => {
    if (slug(name) !== name) {
        throw new Error(`Tag name "${name}" is not valid. It should not contain whitespace or special character.`);
    }
};
