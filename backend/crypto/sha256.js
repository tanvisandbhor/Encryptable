const crypto = require('crypto');

function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// SHA-256 is only a hash; no decrypt function.
module.exports = { hash };
