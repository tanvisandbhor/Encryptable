const express = require('express');
const router = express.Router();
const aes = require('../crypto/aes');
const rsa = require('../crypto/rsa');
const diffieHellman = require('../crypto/diffiehellman');
const des = require('../crypto/des');
const sha256 = require('../crypto/sha256');

router.get('/dh-params', (req, res) => {
  res.json(diffieHellman.getParams());
});

router.post('/encrypt', async (req, res) => {
  try {
    const { algorithm, text, key, otherParams } = req.body;
    let result;

    switch (algorithm) {
      case 'aes':
        result = aes.encrypt(text, key);
        break;
      case 'rsa':
        result = rsa.encrypt(text);
        break;
      case 'diffie-hellman': {
        // ✅ Patch applied here
        const op = otherParams?.op || req.body.op;

        if (op === 'generateKeys') {
          result = diffieHellman.generateKeys();
        } else if (op === 'computeSecret') {
          const otherPublicKey = otherParams?.otherPublicKey || req.body.otherPublicKey;
          const privateKey = otherParams?.privateKey || req.body.privateKey;

          if (!otherPublicKey || !privateKey) {
            return res.status(400).json({ error: 'Missing keys for computeSecret' });
          }

          result = diffieHellman.computeSecret(otherPublicKey, privateKey);
        } else {
          return res.status(400).json({ error: 'Invalid Diffie-Hellman operation' });
        }
        break;
      }
      case 'des':
        result = des.encrypt(text, key);
        break;
      case 'sha256':
        result = sha256.hash(text);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported algorithm' });
    }

    res.json({ result });
  } catch (err) {
    console.error("Backend error:", err); // ✅ helps debug
    res.status(500).json({ error: err.message });
  }
});

router.post('/decrypt', async (req, res) => {
  try {
    const { algorithm, text, key, otherParams } = req.body;
    let result;
    switch (algorithm) {
      case 'aes':
        result = aes.decrypt(text, key);
        break;
      case 'rsa':
        result = rsa.decrypt(text);
        break;
      case 'diffie-hellman':
        return res.status(400).json({ error: 'Diffie-Hellman does not support decrypt' });
      case 'des':
        result = des.decrypt(text, key);
        break;
      case 'sha256':
        return res.status(400).json({ error: 'SHA-256 hash cannot be decrypted' });
      default:
        return res.status(400).json({ error: 'Unsupported algorithm' });
    }
    res.json({ result });
  } catch (err) {
    console.error("Backend error:", err); // ✅ also log decrypt issues
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
