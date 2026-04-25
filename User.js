const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Database = require('../config/database'); // Implementar conforme seu DB

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.isActive = data.isActive || true;
    this.totpSecret = data.totpSecret;
    this.totpEnabled = data.totpEnabled || false;
    this.createdAt = data.createdAt || new Date();
  }

  async hashPassword(password) {
    this.password = await bcrypt.hash(password, 12);
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static async findByEmail(email) {
    // Implementar consulta no banco
    const userData = await Database.getUserByEmail(email);
    return userData ? new User(userData) : null;
  }

  static async create(userData) {
    const user = new User(userData);
    await user.hashPassword(userData.password);
    // Salvar no banco
    return Database.createUser(user);
  }
}

module.exports = User;