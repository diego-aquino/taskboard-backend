import bcrypt from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import config from '~/config';
import { generateToken, verifyToken } from '~/utils/jwt';
import { ExpiredTokenError, InvalidTokenError } from './errors';

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

    try {
      const payload = await verifyToken(accessToken, secretKey);
      return payload;
    } catch (error) {
      return AuthServices.#handleTokenValidationError(error, 'access');
    }
  }

  static async validateRefreshToken(refreshToken) {
    const secretKey = config.jwt.refreshSecretKey;

    try {
      const payload = await verifyToken(refreshToken, secretKey);
      return payload;
    } catch (error) {
      return AuthServices.#handleTokenValidationError(error, 'refresh');
    }
  }

  static #handleTokenValidationError(error, tokenName) {
    if (error instanceof TokenExpiredError) {
      throw new ExpiredTokenError(tokenName);
    }
    if (error instanceof JsonWebTokenError) {
      throw new InvalidTokenError(tokenName);
    }

    throw error;
  }
}

export default AuthServices;
