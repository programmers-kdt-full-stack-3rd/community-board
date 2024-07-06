import crypto from "crypto";

export const makeSalt = (): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        reject(err);
      }
      resolve(buf.toString("base64"));
    });
  });

export const makeHashedPassword = async (
  password: string,
  salt: string
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) {
        reject(err);
      }
      resolve(key.toString("base64"));
    });
  });
