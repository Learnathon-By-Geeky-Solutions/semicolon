import crypto from 'crypto';

export const generateVerificationCode = (): string => {
    const min = 100000;
    const max = 999999;
    const range = max - min + 1;
    
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0);
    const result = min + (randomNumber % range);
    
    return result.toString();
}