import React, { useState, useEffect } from 'react';
import './App.css';
import CipherSelector from './components/CipherSelector';
import TextInput from './components/TextInput';
import KeyInput from './components/KeyInput';
import ResultDisplay from './components/ResultDisplay';
import FileUpload from './components/FileUpload';
import { caesarEncrypt, caesarDecrypt } from './utils/caesarCipher';
import { vigenereEncrypt, vigenereDecrypt } from './utils/vigenereCipher';
import { atbashEncrypt } from './utils/atbashCipher';
import DiffieHellman from './components/DiffieHellman';

function App() {
  const [cipher, setCipher] = useState('caesar');
  const [plainText, setPlainText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encrypt');

  useEffect(() => {
    // Set default keys on cipher change for classical ciphers
    if (cipher === 'caesar') {
      setKey(3);
    } else if (cipher === 'vigenere') {
      setKey('KEY');
    } else {
      setKey('');
    }
  }, [cipher]);

  async function handleSubmit(e) {
    e.preventDefault();

    const classicalCiphers = ['caesar', 'vigenere', 'atbash', 'railfence', 'playfair'];

    if (classicalCiphers.includes(cipher)) {
      // Handle classical ciphers locally
      if (cipher === 'caesar') {
        const shift = Number(key);
        if (isNaN(shift)) {
          alert('Please enter a valid number for Caesar cipher key.');
          return;
        }
        setResult(mode === 'encrypt' ? caesarEncrypt(plainText, shift) : caesarDecrypt(plainText, shift));
      } else if (cipher === 'vigenere') {
        if (!key) {
          alert('Please enter a key for Vigenère cipher.');
          return;
        }
        setResult(mode === 'encrypt' ? vigenereEncrypt(plainText, key) : vigenereDecrypt(plainText, key));
      } else if (cipher === 'atbash') {
        // Atbash only supports encrypt (which is symmetric)
        setResult(atbashEncrypt(plainText));
      }
      // Add railfence and playfair here if implemented
    } else {
      // Handle modern ciphers: send to backend
      try {
        const endpoint = mode === 'encrypt' ? '/encrypt' : '/decrypt';
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";


        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ algorithm: cipher, text: plainText, key }),
});

        
        const data = await response.json();

        if (response.ok) {
          setResult(data.result);
        } else {
          alert('Error: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        alert('Request failed: ' + error.message);
      }
    }
  }

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    alert('Result copied to clipboard!');
  };

  const downloadFile = () => {
    if (!result) return;
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'result.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const keyHelpText = {
    caesar: 'Enter a numeric shift value (e.g., 3)',
    vigenere: 'Enter a keyword (letters only)',
    playfair: 'Enter a keyword (letters only, no repeats)',
    aes: 'Enter a password or key string',
    rsa: 'Use appropriate key pair string',
    'diffie-hellman': 'Use the Diffie-Hellman component below',
    des: 'Enter a password or key string',
    atbash: '',
    sha256: 'SHA-256 doesn’t require a key'
  };

  return (
    <div className="App">
      <h2 className="app-title">Text Encrypt-Decrypt</h2>

      <FileUpload onFileRead={setPlainText} />

      {cipher === 'diffie-hellman' ? (
        <DiffieHellman />
      ) : (
        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="form-group">
            <label htmlFor="cipher-select" className="form-label">Select Cipher Algorithm</label>
            <CipherSelector id="cipher-select" value={cipher} onChange={setCipher} />
          </div>

          <div className="form-group">
            <label htmlFor="input-text" className="form-label">Input Text</label>
            <TextInput id="input-text" label="Input Text" value={plainText} onChange={setPlainText} />
          </div>

          {cipher !== 'atbash' && (
            <div className="form-group">
              <label htmlFor="key-input" className="form-label">
                {cipher === 'caesar' ? 'Key (Shift Number)' : 'Key (Keyword)'}
              </label>
              <KeyInput
                id="key-input"
                value={key}
                onChange={setKey}
                type={cipher === 'caesar' ? 'number' : 'text'}
                placeholder={cipher === 'caesar' ? 'Enter shift amount' : 'Enter keyword'}
              />
              <p className="key-help-text" style={{ color: '#70a1ff', marginTop: '0.3rem', fontSize: '0.9rem' }}>
                {keyHelpText[cipher]}
              </p>
            </div>
          )}

          <div className="form-group mode-selection">
            <label>
              <input
                type="radio"
                checked={mode === 'encrypt'}
                onChange={() => setMode('encrypt')}
                name="mode"
                disabled={cipher === 'atbash'}
              />
              <span className="radio-label">Encrypt</span>
            </label>
            <label>
              <input
                type="radio"
                checked={mode === 'decrypt'}
                onChange={() => setMode('decrypt')}
                name="mode"
                disabled={cipher === 'atbash'}
              />
              <span className="radio-label">Decrypt</span>
            </label>
          </div>

          <button type="submit" className="btn-submit">
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
        </form>
      )}

      <div className="result-section">
        <label htmlFor="result-text" className="form-label">Output Result</label>
        <ResultDisplay id="result-text" result={result} />
        <div className="result-actions">
          <button onClick={copyToClipboard} disabled={!result} className="btn-copy">
            Copy Result
          </button>
          <button onClick={downloadFile} disabled={!result} className="btn-download">
            Download Result
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
