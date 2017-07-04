const expect = require('expect');
const { encrypt, decrypt } = require('./crypto');

describe('Crypto Features', () => {
    it('should keep the consistancy between encryption & decryption', () => {
        const data = 'SOME VERY PRIVATE INFO';
        const passphrase = 'passphrase';
        const algo = 'aes-256-ctr';
        const encryptedData = encrypt(data, passphrase, algo);

        expect(encryptedData).toNotBe(data);

        const decryptedData = decrypt(encryptedData, passphrase);

        expect(decryptedData).toBe(data);
    });

    it('should not return the identic signature twice for the same given entry and passphrase', () => {
        const data = 'SOME VERY PRIVATE INFO';
        const passphrase = 'passphrase';
        const algo = 'aes-256-ctr';

        const encryptedData = encrypt(data, passphrase, algo);
        const encryptedData2 = encrypt(data, passphrase, algo);

        expect(encryptedData).toNotBe(encryptedData2);

        const decryptedData = decrypt(encryptedData, passphrase);
        const decryptedData2 = decrypt(encryptedData2, passphrase);

        expect(decryptedData).toBe(data);
        expect(decryptedData2).toBe(data);
    });
});
