// @ts-ignore
import {randomBytes} from 'react-native-randombytes';
import CryptoJS from 'crypto-js';

function hashPassword(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iterations: 1000,
  }).toString();
}

function createPasswordHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(16, (err: Error | null, salt: Buffer) => {
      if (err) {
        return reject(err);
      }
      const saltHex = salt.toString('hex');
      const hashedPassword = hashPassword(password, saltHex);
      resolve(`${saltHex}$${hashedPassword}`);
    });
  });
}

function verifyPassword(
  inputPassword: string,
  storedHashedPassword: string,
): boolean {
  const [salt, hash] = storedHashedPassword.split('$');
  const inputHash = hashPassword(inputPassword, salt);
  return inputHash === hash;
}

export {hashPassword, createPasswordHash, verifyPassword};
