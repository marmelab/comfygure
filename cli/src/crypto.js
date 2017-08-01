const crypto = require('crypto');

const ALGORITHM = 'aes-256-ctr';
const KEY_BYTE_LENGTH = 32;
const IV_LENGTH = 16;

const hexToBuffer = hex => new Buffer(hex, 'hex');
const bufferToHex = buffer => buffer.toString('hex');

const bufferize = (key, tryToCast = true) => {
    if (!Buffer.isBuffer(key) || key.length !== KEY_BYTE_LENGTH) {
        if (tryToCast) {
            return bufferize(hexToBuffer(key), false);
        }

        throw new Error(`The "key" parameter should be a ${KEY_BYTE_LENGTH} bytes Buffer`);
    }

    return key;
};

const encrypt = (value, hexKey) => {
    const key = bufferize(hexKey);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const cipherText = cipher.update(value, 'utf-8', 'hex') + cipher.final('hex');

    return `${ALGORITHM}:${iv.toString('hex')}:${cipherText}`;
};

const decrypt = (entry, hexKey) => {
    const key = bufferize(hexKey);

    const [algorithm, hexIV, value] = entry.split(':');

    if (algorithm !== ALGORITHM) {
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    const iv = hexToBuffer(hexIV);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    return decipher.update(value, 'hex', 'utf-8') + decipher.final('utf-8');
};

const generateNewPrivateKey = () => bufferToHex(crypto.randomBytes(KEY_BYTE_LENGTH));

module.exports = {
    ALGORITHM,
    IV_LENGTH,
    KEY_BYTE_LENGTH,
    encrypt,
    decrypt,
    generateNewPrivateKey,
};
