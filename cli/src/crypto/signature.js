const crypto = require('crypto');

const ALGORITHM = 'SHA256';

const sign = (cipherText, iv, hmacKey) => {
    const hmac = crypto.createHmac(ALGORITHM, hmacKey);
    hmac.update(cipherText);
    hmac.update(iv);

    return hmac.digest('hex');
};

const isSignatureValid = (cipherText, iv, hmacKey, signature) => {
    const control = sign(cipherText, iv, hmacKey);

    return control === signature;
};

module.exports = { sign, isSignatureValid };
