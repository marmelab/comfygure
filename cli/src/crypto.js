const crypto = require('crypto');

const ALGORITHM = 'aes-256-ctr';
const KEY_BYTE_LENGTH = 32;
const IV_LENGTH = 16;

const hexToBuffer = hex => new Buffer(hex, 'hex');
const bufferToHex = buffer => buffer.toString('hex');

const castKeyToBuffer = (key, castToBuffer = true) => {
    if (Buffer.isBuffer(key)) {
        if (key.length === KEY_BYTE_LENGTH) {
            return key;
        }

        throw new Error(`The "key" argument must be a ${KEY_BYTE_LENGTH} bytes Buffer`);
    }

    if (castToBuffer) {
        return castKeyToBuffer(hexToBuffer(key), false);
    }

    throw new Error('The "key" argument is must be a Buffer or a hexadecimal-encoded string');
};

const encrypt = (value, hexKey) => {
    const key = castKeyToBuffer(hexKey);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const cipherText = Buffer.concat([cipher.update(value, 'utf-8'), cipher.final()]);

    return `${ALGORITHM}:${iv.toString('hex')}:${cipherText.toString('hex')}`;
};

const decrypt = (entry, hexKey) => {
    const key = castKeyToBuffer(hexKey);

    const [algorithm, hexIV, value] = entry.split(':');

    if (algorithm !== ALGORITHM) {
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    const iv = hexToBuffer(hexIV);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    const decipherText = Buffer.concat([decipher.update(value, 'hex'), decipher.final()]);

    return decipherText.toString('utf-8');
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
