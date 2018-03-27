const { encrypt, decrypt, generateNewPrivateKey, generateNewHmacKey } = require('./');

describe('Crypto Features', () => {
    it('should keep the consistancy between encryption & decryption', () => {
        const data = 'SOME VERY PRIVATE INFO';
        const privateKey = generateNewPrivateKey();
        const hmacKey = generateNewHmacKey();
        const encryptedData = encrypt(data, privateKey, hmacKey);

        expect(encryptedData).not.toBe(data);

        const decryptedData = decrypt(encryptedData, privateKey, hmacKey);

        expect(decryptedData).toBe(data);
    });

    it('should not return an identical signature twice for the same given entry and private key', () => {
        const data = 'SOME VERY PRIVATE INFO';
        const privateKey = generateNewPrivateKey();
        const hmacKey = generateNewHmacKey();

        const encryptedData = encrypt(data, privateKey, hmacKey);
        const encryptedData2 = encrypt(data, privateKey, hmacKey);

        expect(encryptedData).not.toBe(encryptedData2);

        const decryptedData = decrypt(encryptedData, privateKey, hmacKey);
        const decryptedData2 = decrypt(encryptedData2, privateKey, hmacKey);

        expect(decryptedData).toBe(data);
        expect(decryptedData2).toBe(data);
    });

    it('should throw an error if the data is tampered', () => {
        const data = 'SOME VERY PRIVATE INFO';
        const privateKey = generateNewPrivateKey();
        const hmacKey = generateNewHmacKey();
        const encryptedData = encrypt(data, privateKey, hmacKey);

        const [algorithm, cipherText, iv, signature] = encryptedData.split(':');
        const tamperedData = `${algorithm}:${cipherText}:${iv}:${signature}tampered`;

        expect(() => {
            decrypt(tamperedData, privateKey, hmacKey);
        }).toThrow(/tampered/);

        expect(() => {
            decrypt(encryptedData, privateKey, hmacKey);
        }).not.toThrow();
    });
});
