import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export class InvalidTokenError extends JsonWebTokenError {
  constructor(tokenName) {
    super(`Invalid or missing ${tokenName} token.`);
  }
}

export class ExpiredTokenError extends TokenExpiredError {
  constructor(tokenName) {
    super(`Invalid or missing ${tokenName} token.`);
  }
}
