const crypto = require("crypto");

// Đảm bảo SECRET_KEY có độ dài 32 byte
const SECRET_KEY = process.env.SECRET_KEY;
const IV_LENGTH = 16;

if (!SECRET_KEY || Buffer.from(SECRET_KEY).length !== 32) {
  throw new Error(
    "SECRET_KEY must be a 32-byte (256-bit) string for aes-256-cbc."
  );
}

// Mã hóa token
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Giải mã token
function decrypt(text) {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
