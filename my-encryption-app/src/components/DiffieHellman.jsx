// components/DiffieHellman.js
import React, { useState, useEffect } from 'react';

export default function DiffieHellman() {
  const [prime, setPrime] = useState('');
  const [generator, setGenerator] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [partnerPublicKey, setPartnerPublicKey] = useState('');
  const [sharedSecret, setSharedSecret] = useState('');
  const [error, setError] = useState('');
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [secretError, setSecretError] = useState('');

  // load DH params from backend
  useEffect(() => {
   fetch(`${import.meta.env.VITE_API_URL}/encrypt`)
      .then((res) => res.json())
      .then((data) => {
        setPrime(data.prime);
        setGenerator(data.generator);
      })
      .catch((err) => setError('Failed to load DH parameters: ' + err.message));
  }, []);

  async function generateKeys() {
    setLoadingKeys(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'diffie-hellman', otherParams: { op: 'generateKeys' } }),
      });
      const data = await response.json();
      console.log('Generated keys:', data.result);

      if (response.ok) {
        setPrivateKey(data.result.privateKey);
        setPublicKey(data.result.publicKey);
        // no need to reset prime/generator since they’re fixed
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingKeys(false);
    }
  }

  async function computeSharedSecret() {
    setLoadingSecret(true);
    setSecretError('');

    if (!partnerPublicKey) {
      setSecretError("Please enter partner's public key.");
      setLoadingSecret(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: 'diffie-hellman',
          otherParams: {
            op: 'computeSecret',
            otherPublicKey: partnerPublicKey,
            privateKey,
          },
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSharedSecret(data.result);
      } else {
        setSecretError(data.error);
      }
    } catch (err) {
      setSecretError(err.message);
    } finally {
      setLoadingSecret(false);
    }
  }

  return (
    <div className="diffie-hellman-container">
      <h3>Diffie-Hellman Key Exchange</h3>

      <button onClick={generateKeys} disabled={loadingKeys}>
        {loadingKeys ? 'Generating Keys...' : 'Generate My Keys'}
      </button>

      {prime && (
        <div>
          <label>Prime (Hex):</label>
          <textarea readOnly rows={4} style={{ width: '100%', wordBreak: 'break-all' }} value={prime} />
        </div>
      )}

      {generator && (
        <div>
          <label>Generator (Hex):</label>
          <textarea readOnly rows={2} style={{ width: '100%', wordBreak: 'break-all' }} value={generator} />
        </div>
      )}

      <div>
        <label>My Public Key:</label>
        <textarea
          readOnly
          rows={4}
          style={{ width: '100%', wordBreak: 'break-all' }}
          value={publicKey || 'Public key not generated'}
        />
      </div>

      <div>
        <label>Partner's Public Key:</label>
        <textarea
          rows={4}
          style={{ width: '100%', wordBreak: 'break-all' }}
          value={partnerPublicKey}
          onChange={(e) => setPartnerPublicKey(e.target.value)}
        />
      </div>

      <button onClick={computeSharedSecret} disabled={loadingSecret || !privateKey}>
        {loadingSecret ? 'Computing Shared Secret...' : 'Compute Shared Secret'}
      </button>

      {secretError && <p style={{ color: 'red' }}>{secretError}</p>}

      {sharedSecret && (
        <div>
          <label>Shared Secret (Base64):</label>
          <textarea readOnly rows={4} style={{ width: '100%', wordBreak: 'break-all' }} value={sharedSecret} />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
