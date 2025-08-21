// utils/caesarCipher.js
export function caesarEncrypt(text, shift) {
  return text.split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // Uppercase
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      } else {
        // Non-alpha
        return char;
      }
    }).join('');
}

export function caesarDecrypt(text, shift) {
  // To decrypt, subtract the shift
  return caesarEncrypt(text, (26 - shift) % 26);
}
