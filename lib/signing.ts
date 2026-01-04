import crypto from "crypto";

export function signHash(hash: string, privateKey: Buffer) {
  const signature = crypto.sign(
    null,
    Buffer.from(hash),
    privateKey
  );
  return signature.toString("base64");
}

export function verifyHash(
  hash: string,
  signature: string,
  publicKey: Buffer
) {
  return crypto.verify(
    null,
    Buffer.from(hash),
    publicKey,
    Buffer.from(signature, "base64")
  );
}
