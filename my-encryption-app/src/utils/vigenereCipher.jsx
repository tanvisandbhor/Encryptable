// utils/vigenereCipher.js
export function vigenereEncrypt(text, key) {
  let result = '';
  let keyIndex = 0;
  const keyLength = key.length;

  for (let i=0; i < text.length; i++) {
    let char = text[i];
    const charCode = text.charCodeAt(i);

    if (char.match(/[a-z]/i)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;

      const keyChar = key[keyIndex % keyLength].toUpperCase();
      const keyShift = keyChar.charCodeAt(0) - 65;

      const encryptedChar = String.fromCharCode(
        ((charCode - base + keyShift) % 26) + base
      );

      result += encryptedChar;
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

export function vigenereDecrypt(text, key) {
  let result = '';
  let keyIndex = 0;
  const keyLength = key.length;

  for (let i=0; i < text.length; i++) {
    let char = text[i];
    const charCode = text.charCodeAt(i);

    if (char.match(/[a-z]/i)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;

      const keyChar = key[keyIndex % keyLength].toUpperCase();
      const keyShift = keyChar.charCodeAt(0) - 65;

      const decryptedChar = String.fromCharCode(
        ((charCode - base - keyShift + 26) % 26) + base
      );

      result += decryptedChar;
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}
