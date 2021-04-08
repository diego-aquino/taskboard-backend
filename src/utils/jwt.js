import jwt from 'jsonwebtoken';

export function generateToken(payload, secretKey, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, options, (error, token) =>
      error ? reject(error) : resolve(token),
    );
  });
}

export function verifyToken(token, secretKey, options = {}) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, options, (error, decoded) =>
      error ? reject(error) : resolve(decoded),
    );
  });
}
