import crypto from "crypto";

export const generateVerificationCode = (): string => {
  const min = 100000;
  const max = 999999;
  const range = max - min + 1;

  const maxValidValue = Math.floor(0xffffffff / range) * range;

  let randomNumber;
  do {
    const randomBytes = crypto.randomBytes(4);
    randomNumber = randomBytes.readUInt32BE(0);
  } while (randomNumber >= maxValidValue);
  const result = min + (randomNumber % range);

  return result.toString();
};
