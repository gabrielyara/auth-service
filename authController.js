const authService = require('../services/authService');
const tokenService = require('../services/tokenService');

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async refresh(req, res) {
    try {
      const { userId, refreshToken } = req.body;
      const tokens = await authService.refreshToken(userId, refreshToken);
      
      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async setup2FA(req, res) {
    try {
      const { userId } = req.user; // Do middleware auth
      const result = await authService.setup2FA(userId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();