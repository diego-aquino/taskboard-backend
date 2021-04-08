import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import AuthServices from '~/services/auth';

class AuthMiddleware {
  static async authenticate(request, response, next) {
    try {
      const authHeader = request.headers.authorization;
      const { accountId } = await AuthServices.validateAuthHeader(authHeader);

      request.locals.accountId = accountId;
      return next();
    } catch (error) {
      return AuthMiddleware.#handleError(error, { response, next });
    }
  }

  static #handleError(error, { response, next }) {
    if (error instanceof TokenExpiredError) {
      return response.status(401).json({ message: 'Expired access token.' });
    }

    if (error instanceof JsonWebTokenError) {
      return response.status(401).json({
        message: 'Invalid or missing access token.',
      });
    }

    return next(error);
  }
}

export default AuthMiddleware;
