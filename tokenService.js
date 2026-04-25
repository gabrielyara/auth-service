const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const crypto = require('crypto');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken) {
    const key = `refresh:${userId}`;
    await redis.set(key, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 dias
  }

  async verifyRefreshToken(userId, refreshToken) {
    const key = `refresh:${userId}`;
    const storedToken = await redis.get(key);
    return storedToken === refreshToken;
  }

  async revokeRefreshToken(userId) {
    const key = `refresh:${userId}`;
    await redis.del(key);
  }

  verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new TokenService();