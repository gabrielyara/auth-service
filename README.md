# Auth Service 🔐

[![Node.js](https://img.shields.io/badge/node.js-v18-green?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=flat&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat&logo=mit)](https://opensource.org/licenses/MIT)

## 📖 Descrição

**Microserviço de Autenticação completo e production-ready** com:

- 🔐 **JWT Access + Refresh Tokens**
- 🛡️ **2FA TOTP** (Google Authenticator)
- 🗄️ **Redis** para sessões
- ⚡ **Rate Limiting**
- 🛡️ **Segurança completa** (Helmet, CORS, bcrypt)
- 🐳 **Docker Compose**
- 📊 **Health Checks + Logging**

> **100% funcional - Copie, cole e deploy!**

## ✨ Funcionalidades

| Feature | Status |
| :------ | :------|
| Registro/Login JWT |✅ |
| Refresh Tokens (Redis)| ✅ |
| 2FA TOTP + QR Code| ✅ |
| Rate Limiting (IP) | ✅ |
| Validação de entrada | ✅ |
| Security Headers |✅ |
| CORS configurável |✅ |
| Health Check | ✅ |
| Docker Production |✅ |

## 🚀 Início Rápido 

1. Pré-requisitos

   ```
   Node.js 18+ | Docker | Redis
   ```
   
2. Setup (Powershell/Windows)
   ```powershell
   # Criar projeto
    mkdir auth-service; cd auth-service

   # Instalar dependências
    npm init -y
    npm install express bcryptjs jsonwebtoken redis ioredis speakeasy qrcode dotenv helmet cors express-rate-limit express-validator uuid winston morgan
    npm install -D nodemon

   # Configurar
    cp .env.example .env
   ```
   
3. Executar
   ```powershell
   # Desenvolvimento (Hot Reload)
    npm run dev

   # Produção
    npm start

   # Docker (Recomendado)
    docker-compose up --build -d
   ```

## 📁 Estrutura do Projeto

```mermaid
graph TD
    A[auth-service/] --> B[src/]
    A --> C[.env.example]
    A --> D[docker-compose.yml]
    A --> E[package.json]
    A --> F[README.md]
    
    B --> B1[config/]
    B --> B2[controllers/]
    B --> B3[middleware/]
    B --> B4[models/]
    B --> B5[routes/]
    B --> B6[services/]
    B --> B7[app.js]
    
    B6 --> B6a[authService.js]
    B6 --> B6b[tokenService.js<br/>← JWT Refresh]
    B6 --> B6c[otpService.js<br/>← 2FA TOTP]
```

## 🔌 API Endpoints
  **Autenticação**
  
| Endpoint | Método | Autenticação | Descrição |
| :------- | :------| :----------- | :---------|
| /api/auth/register |POST | | Criar Conta |
| /api/auth/login | POST | | Logins + Tokens |
| /api/auth/refresh | POST | | Renovar token |
| /api/auth/2fa/setup | POST | Bearer | Configurar 2FA |

***Health***
  ```
    GET /health
  ```
## 💬 Exemplos de Uso

1. Registrar Usuário

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
    "email": "user@example.com",
    "password": "12345678"
   }'
   ```
   
2. Login
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
    "email": "user@example.com",
    "password": "12345678"
   }'
   ```

Resposta:
  ```]son
  {
  "success": true,
  "data": {
    "user": {"id": "uuid", "email": "user@example.com"},
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "a1b2c3d4e5f67890..."
    },
    "requires2FA": false
  }
}
```

3. Refresh Token
   
   ```bash
   curl -X POST http://localhost:3000/api/auth/refresh \
    -H "Content-Type: application/json" \
    -d '{
    "userId": "uuid-do-usuario",
    "refreshToken": "a1b2c3d4e5f67890..."
   }'
   ```

4. Setup 2FA
   ```
   curl -X POST http://localhost:3000/api/auth/2fa/setup \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
    -H "Content-Type: application/json"
   ```
   
## 🔐 Fluxo Completo

```mermaid
    graph TD
    A[Client: Register/Login] --> B[Auth Service: Validate]
    B --> C{2FA Enabled?}
    C -->|Não| D[Return Tokens]
    C -->|Sim| E[Generate QR Code]
    E --> F[Client: Scan + Verify]
    F --> D
    D --> G[Save Refresh Redis]
    G --> H[Client: Use Access Token]
    H --> I[Token Expired?]
    I -->|Sim| J[Refresh Token]
    J --> D
```

## ⚙️ Configuração (.env)

```env
# ========================================
# SERVER
# ========================================
PORT=3000
NODE_ENV=production

# ========================================
# JWT (gere chaves seguras!)
# ========================================
JWT_SECRET=seu-jwt-secret-super-seguro-64-chars-min
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ========================================
# REDIS
# ========================================
REDIS_URL=redis://localhost:6379
REDIS_TTL=86400

# ========================================
# 2FA TOTP
# ========================================
TOTP_ISSUER=AuthService
TOTP_LENGTH=6
TOTP_PERIOD=30

# ========================================
# RATE LIMIT (15min/100 requests)
# ========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 🐳 Docker Compose (Production)

```yaml
version: '3.8'
services:
  auth-service:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  redis_data:
```

Executar:
```powershell
docker-compose up --build -d
docker-compose logs -f auth-service
```

## 🛡️ Segurança

| Proteção | Implementado | Biblioteca |
| :------- | :------| :----------- | 
| XSS/CSRF |✅ |  Helmet |
| CORS | ✅ |  cors |
| Rate Limit | ✅ |  express-rate-limit |
| SQL Injection | ✅ | Prepared Statements |
| Password Hash | ✅ | bcryptjs (12 rounds) |
| JWT Secure | ✅ | jsonwebtoken HS256 |
| Token Blacklist | ✅ | Redis |

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch feature/xyz
3. Commit suas mudanças
4. Push para branch
5. Abra um Pull Request

## 📄 Licença
MIT License - veja LICENSE

## 👨‍💻 Autor
Desenvolvido com ⚡ por **Gabriel Yara**

<div align="center"> <br/> <img src="https://img.shields.io/badge/⭐-Star_this_repo!-brightgreen.svg" alt="Star"/> <img src="https://img.shields.io/badge/📢-Made_with_Love-blue.svg" alt="Love"/> </div>
