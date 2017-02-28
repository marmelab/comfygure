const crypto = require('crypto');

const encrypt = (value, passphrase, algorithm = 'aes-256-ctr') => {
    const cipher = crypto.createCipher(algorithm, passphrase);
    const crypted = cipher.update(value, 'utf-8', 'hex');

    return `${algorithm}:${crypted + cipher.final('hex')}`;
};

const decrypt = (entry, passphrase) => {
    const [algorithm, value] = entry.split(':');
    const decipher = crypto.createDecipher(algorithm, passphrase);
    const decrypted = decipher.update(value, 'hex', 'utf-8');

    return decrypted + decipher.final('utf-8');
};

module.exports = { encrypt, decrypt };
