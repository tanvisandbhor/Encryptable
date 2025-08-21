// utils/atbashCipher.js (Example)
export function atbashEncrypt(text) {
  return text.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
    } else if (char >= 'a' && char <= 'z') {
      return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
    } else {
      return char;
    }
  }).join('');
}

export const atbashDecrypt = atbashEncrypt; // Atbash is its own inverse
