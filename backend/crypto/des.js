const crypto = require('crypto');

const algorithm = 'des-ede3-cbc';

function encrypt(text, key) {
  const keyBuffer = crypto.createHash('sha256').update(key).digest().slice(0, 24); // DES key length: 24 bytes (3DES)
  const iv = crypto.randomBytes(8);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return `${iv.toString('base64')}:${encrypted}`;
}

function decrypt(encData, key) {
  const [ivBase64, encrypted] = encData.split(':');
  if (!ivBase64 || !encrypted) throw new Error('Invalid encrypted data format.');
  const keyBuffer = crypto.createHash('sha256').update(key).digest().slice(0, 24);
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
