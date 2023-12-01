import CryptoJS from 'crypto-js';

export function encryptStringToJson(stringToEncrypt: string, password: string): string {
  // Encrypt the string
  const encryptedString = CryptoJS.AES.encrypt(stringToEncrypt, password).toString();

  // Create a JSON object with the encrypted string
  const encryptedJson = {
    data: encryptedString
  };

  return JSON.stringify(encryptedJson);
}

export function decryptJsonToString(encryptedJsonString: string, password: string): string {
  // Parse the JSON string
  const encryptedJson = JSON.parse(encryptedJsonString);

  // Decrypt the data from JSON
  const decryptedData = CryptoJS.AES.decrypt(encryptedJson.data, password).toString(CryptoJS.enc.Utf8);

  return decryptedData;
}
