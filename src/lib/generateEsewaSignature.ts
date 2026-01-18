import CryptoJS from "crypto-js";

/**
 * Generate eSewa signature using HMAC-SHA256
 * @param secretKey - eSewa secret key
 * @param message - Message to sign (format: "total_amount=X,transaction_uuid=Y,product_code=Z")
 * @returns Base64 encoded signature
 */
export function generateEsewaSignature(
  secretKey: string,
  message: string
): string {
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}
