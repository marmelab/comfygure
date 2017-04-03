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
});
