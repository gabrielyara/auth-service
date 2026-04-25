const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], rateLimit.login, authController.register);

router.post('/login', rateLimit.login, authController.login);
router.post('/refresh', authController.refresh);
router.post('/2fa/setup', authMiddleware, authController.setup2FA);

module.exports = router;