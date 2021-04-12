import bcrypt from 'bcrypt';

import config from '~/config';
import { generateToken, verifyToken } from '~/utils/jwt';

class AuthServices {
  static async generateAuthCredentials(accountId) {
    const [accessToken, refreshToken] = await Promise.all([
      AuthServices.generateAccountAccessToken(accountId),
      AuthServices.generateAccountRefreshToken(accountId),
    ]);

    return { accessToken, refreshToken };
  }

  static generateAccountAccessToken(accountId) {
    const secretKey = config.jwt.accessSecretKey;
    const expiresIn = config.jwt.sessionExpiresIn;
    return generateToken({ accountId }, secretKey, { expiresIn });
  }

  static generateAccountRefreshToken(accountId) {
    const secretKey = config.jwt.refreshSecretKey;
    return generateToken({ accountId }, secretKey);
  }

  static async comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static validateAuthHeader(authHeader) {
    const accessToken = AuthServices.extractAuthHeaderAccessToken(authHeader);
    return AuthServices.validateAccessToken(accessToken);
  }

  static extractAuthHeaderAccessToken(authHeader) {
    const matches = /^Bearer (.+)$/.exec(authHeader);

    if (!matches) return null;

    const accessToken = matches[1];
    return accessToken;
  }

  static async validateAccessToken(accessToken) {
    const secretKey = config.jwt.accessSecretKey;
    return verifyToken(accessToken, secretKey);
  }
}

export default AuthServices;
