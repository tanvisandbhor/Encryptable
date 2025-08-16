const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

function encrypt(plainText, key) {
  const keyBuffer = crypto.createHash('sha256').update(key).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return `${iv.toString('base64')}:${encrypted}`;
}

function decrypt(encData, key) {
  const [ivBase64, encrypted] = encData.split(':');
  if (!ivBase64 || !encrypted) throw new Error('Invalid encrypted data format.');
  const keyBuffer = crypto.createHash('sha256').update(key).digest();
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
