import config from '~/config';
import { generateToken } from '~/utils/jwt';

class AuthServices {
  static generateAccountAccessToken(accountId) {
    const secretKey = config.jwt.accessSecretKey;
    const expiresIn = config.jwt.sessionExpiresIn;
    return generateToken({ accountId }, secretKey, { expiresIn });
  }

  static generateAccountRefreshToken(accountId) {
    const secretKey = config.jwt.refreshSecretKey;
    return generateToken({ accountId }, secretKey);
  }
}

export default AuthServices;
