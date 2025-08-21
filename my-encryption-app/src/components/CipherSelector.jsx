// components/CipherSelector.js
import React from 'react';

export default function CipherSelector({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="caesar">Caesar Cipher (Classical)</option>
      <option value="vigenere">Vigenère Cipher (Classical)</option>
      <option value="atbash">Atbash Cipher (Classical)</option>
      <option value="railfence">Rail Fence Cipher (Classical)</option>
      <option value="aes">AES (Symmetric)</option>
      <option value="rsa">RSA (Asymmetric)</option>
      <option value="diffie-hellman">Diffie–Hellman (Key Exchange)</option>
      <option value="des">DES (Symmetric, legacy)</option>
<option value="playfair">Playfair Cipher (Classical)</option>
<option value="sha256">SHA-256 Hash (Message Digest)</option>

    </select>
  );
}

