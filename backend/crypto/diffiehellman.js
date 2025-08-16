// const crypto = require('crypto');

// // Fixed 2048-bit MODP Group prime (base64)
// const fixedParams = {
//   prime:
//     'ALbPChAwQrnwOqEKfiXk7ya/zRm0hc/87uCRVXQAnPML3WXNOzzpxLPeot7W+7KW1VVmq8oa6tXtbu7LPzE+GZSG7ypn0nXxZahMGRcxsDjgTgQ3le2rpBpc+QciOueWx3dpzcsu41MEBjA0Xl3hb8EeOOAx6oOn/5JiTeRoTXNIlyH/gk4r4zGu5FT0=',
//   generator: 'Ag==' // base64 for 2
// };

// function getParams() {
//   return fixedParams;
// }

// function generateKeys() {
//   const dhInstance = crypto.createDiffieHellman(
//     Buffer.from(fixedParams.prime, 'base64'),
//     Buffer.from(fixedParams.generator, 'base64')
//   );
//   dhInstance.generateKeys();
//   return {
//     prime: fixedParams.prime,
//     generator: fixedParams.generator,
//     privateKey: dhInstance.getPrivateKey('base64'),
//     publicKey: dhInstance.getPublicKey('base64')
//   };
// }

// function computeSecret(otherPublicKeyBase64, privateKeyBase64) {
//   const dhInstance = crypto.createDiffieHellman(
//     Buffer.from(fixedParams.prime, 'base64'),
//     Buffer.from(fixedParams.generator, 'base64')
//   );
//   dhInstance.setPrivateKey(Buffer.from(privateKeyBase64, 'base64'));
//   return dhInstance.computeSecret(Buffer.from(otherPublicKeyBase64, 'base64')).toString('base64');
// }

// module.exports = { getParams, generateKeys, computeSecret };


// crypto/diffiehellman.js
const crypto = require('crypto');

// Using a standard 2048-bit MODP Group prime (RFC 3526, Group 14)
const fixedParams = {
  prime:
    'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E08' +
    '8A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD' +
    '3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E' +
    '7EC6F44C42E9A63A36210000000000090563',
  generator: '02' // standard generator = 2
};

function getParams() {
  // return fixed params (hex form, safe for frontend display)
  return fixedParams;
}

function generateKeys() {
  const dhInstance = crypto.createDiffieHellman(
    Buffer.from(fixedParams.prime, 'hex'),
    Buffer.from(fixedParams.generator, 'hex')
  );
  dhInstance.generateKeys();

  return {
    prime: fixedParams.prime, // hex
    generator: fixedParams.generator, // hex
    privateKey: dhInstance.getPrivateKey('base64'),
    publicKey: dhInstance.getPublicKey('base64')
  };
}

function computeSecret(otherPublicKeyBase64, privateKeyBase64) {
  const dhInstance = crypto.createDiffieHellman(
    Buffer.from(fixedParams.prime, 'hex'),
    Buffer.from(fixedParams.generator, 'hex')
  );

  dhInstance.setPrivateKey(Buffer.from(privateKeyBase64, 'base64'));

  return dhInstance
    .computeSecret(Buffer.from(otherPublicKeyBase64, 'base64'))
    .toString('base64');
}

module.exports = { getParams, generateKeys, computeSecret };
