const User = require('../models/User');
const tokenService = require('./tokenService');
const otpService = require('./otpService');

class AuthService {
  async register(email, password) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const user = await User.create({ email, password });
    return { id: user.id, email: user.email };
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new Error('Conta desativada');
    }

    const tokens = tokenService.generateTokens({ userId: user.id, email });
    await tokenService.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, totpEnabled: user.totpEnabled },
      tokens,
      requires2FA: user.totpEnabled
    };
  }

  async refreshToken(userId, refreshToken) {
    const isValid = await tokenService.verifyRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new Error('Token inválido');
    }

    const tokens = tokenService.generateTokens({ userId, email: '' });
    await tokenService.saveRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async setup2FA(userId) {
    const secret = otpService.generateSecret(userId);
    const qrCode = await otpService.generateQRCode(secret);
    
    // Salvar secret no usuário (implementar update no banco)
    // await User.updateTOTP(userId, secret.base32);
    
    return { secret: secret.base32, qrCode };
  }

  async verify2FA(userId, token) {
    // const user = await User.findById(userId);
    // if (!otpService.verifyToken(user.user.totpSecret, token)) {
    //   throw new Error('Código 2FA inválido');
    // }
    
    // Ativar 2FA no usuário
    // await User.enableTOTP(userId);
    
    return true;
  }
}

module.exports = new AuthService();