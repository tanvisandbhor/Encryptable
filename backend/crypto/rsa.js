const crypto = require('crypto');

// Load or generate your RSA keys (PEM format)
// For demo, you must replace these with your actual keys!
const publicKey = `-----BEGIN PUBLIC KEY-----
...your-public-key...
-----END PUBLIC KEY-----`;

const privateKey = `-----BEGIN PRIVATE KEY-----
...your-private-key...
-----END PRIVATE KEY-----`;

function encrypt(text) {
  const buffer = Buffer.from(text, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return encrypted.toString('base64');
}

function decrypt(encryptedText) {
  const buffer = Buffer.from(encryptedText, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
