const crypto = require('crypto');
const { sign, isSignatureValid } = require('./signature');

const ALGORITHM = 'aes-256-ctr';
const KEY_BYTE_LENGTH = 32;
const IV_LENGTH = 16;
const HMAC_KEY_LENGTH = 32;

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

const encrypt = (value, privateKey, hmacKey) => {
    const key = castKeyToBuffer(privateKey);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const cipherText = Buffer.concat([cipher.update(value, 'utf-8'), cipher.final()]);
    const signature = sign(cipherText, iv, hmacKey);

    return `${ALGORITHM}:${iv.toString('hex')}:${cipherText.toString('hex')}:${signature}`;
};

const decrypt = (entry, privatekey, hmacKey) => {
    const key = castKeyToBuffer(privatekey);

    const [algorithm, hexIV, cipherText, signature] = entry.split(':');

    if (algorithm !== ALGORITHM) {
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    const iv = hexToBuffer(hexIV);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    if (!isSignatureValid(hexToBuffer(cipherText), iv, hmacKey, signature)) {
        throw new Error('An encrypted value has been tampered. Aborting decryption.');
    }

    const decipherText = Buffer.concat([decipher.update(cipherText, 'hex'), decipher.final()]);

    return decipherText.toString('utf-8');
};

const generateNewPrivateKey = () => bufferToHex(crypto.randomBytes(KEY_BYTE_LENGTH));
const generateNewHmacKey = () => bufferToHex(crypto.randomBytes(HMAC_KEY_LENGTH));

module.exports = {
    ALGORITHM,
    IV_LENGTH,
    KEY_BYTE_LENGTH,
    encrypt,
    decrypt,
    generateNewPrivateKey,
    generateNewHmacKey,
};
