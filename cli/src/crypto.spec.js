const expect = require('expect');
const { encrypt, decrypt, generateNewPrivateKey } = require('./crypto');

describe('Crypto Features', () => {
    it('should keep the consistancy between encryption & decryption', () => {
        const data = 'SOME VERY PRIVATE INFO';
        const privateKey = generateNewPrivateKey();
        const encryptedData = encrypt(data, privateKey);

        expect(encryptedData).toNotBe(data);

        const decryptedData = decrypt(encryptedData, privateKey);

        expect(decryptedData).toBe(data);
    });

    it('should not return the identic signature twice for the same given entry and private key', () => {
        const data = 'SOME VERY PRIVATE INFO';
        const privateKey = generateNewPrivateKey();

        const encryptedData = encrypt(data, privateKey);
        const encryptedData2 = encrypt(data, privateKey);

        expect(encryptedData).toNotBe(encryptedData2);

        const decryptedData = decrypt(encryptedData, privateKey);
        const decryptedData2 = decrypt(encryptedData2, privateKey);

        expect(decryptedData).toBe(data);
        expect(decryptedData2).toBe(data);
    });
});
