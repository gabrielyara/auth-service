const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const redis = require('../config/redis');

class OTPService {
  generateSecret(userId) {
    const secret = speakeasy.generateSecret({
      name: `${process.env.TOTP_ISSUER} (${userId})`,
      issuer: process.env.TOTP_ISSUER,
      length: 32
    });

    return secret;
  }

  async generateQRCode(secret) {
    return QRCode.toDataURL(secret.otpauth_url);
  }

  verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });
  }

  async saveOTPSession(userId, code, expiresIn = 300) {
    const key = `otp:${userId}`;
    await redis.set(key, code, 'EX', expiresIn);
  }

  async verifyOTPSession(userId, code) {
    const key = `otp:${userId}`;
    const storedCode = await redis.get(key);
    return storedCode === code;
  }
}

module.exports = new OTPService();