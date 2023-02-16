import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { Encrypter } from "./Encrypter.mjs";

console.log("Hello: ");

const encrypter = new Encrypter("secret");

const clearText = "adventure time";
const encrypted = encrypter.encrypt(clearText);
const dencrypted = encrypter.dencrypt(encrypted);

console.log("text: ", dencrypted);

console.log({ worked: clearText === dencrypted });
