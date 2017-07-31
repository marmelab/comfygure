const crypto = require('crypto');

const ALGORITHM = 'aes-256-ctr';
const KEY_BYTE_LENGTH = 32;
const IV_LENGTH = 16;

const checkKeyLength = (key) => {
    if (!Buffer.isBuffer(key) || key.length !== KEY_BYTE_LENGTH) {
        throw new Error(`The "key" parameter should be a ${KEY_BYTE_LENGTH} bytes Buffer`);
    }
};

const encrypt = (value, key) => {
    checkKeyLength(key);

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const cipherText = cipher.update(value, 'utf-8', 'hex') + cipher.final('hex');

    return `${ALGORITHM}:${iv.toString('hex')}:${cipherText}`;
};

const decrypt = (entry, key) => {
    checkKeyLength(key);

    const [algorithm, hexIV, value] = entry.split(':');

    if (algorithm !== ALGORITHM) {
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    const iv = new Buffer(hexIV, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    return decipher.update(value, 'hex', 'utf-8') + decipher.final('utf-8');
};

module.exports = {
    ALGORITHM,
    IV_LENGTH,
    KEY_BYTE_LENGTH,
    encrypt,
    decrypt,
};
