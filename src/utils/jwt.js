import jwt from 'jsonwebtoken';

export function generateToken(payload, secretKey, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, options, (error, token) =>
      error ? reject(error) : resolve(token),
    );
  });
}
