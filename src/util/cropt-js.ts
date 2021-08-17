// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js');

export function encropt(message: string, croptKey: string) {
  return CryptoJS.AES.encrypt(message, croptKey).toString();
}

export function decypt(ciphertext: string, croptKey: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, croptKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
