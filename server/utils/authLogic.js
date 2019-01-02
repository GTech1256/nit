import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';

export function getPayloadForAuth(user) {
  if (!user) {
    throw new Error('parameters not setted');
  }
  return {
    email: user.email,
    // username: user.username, // fisrt, last, sur
    // roles: user.roles,
  };
}
export function getRefreshToken(user) {
  if (!user) {
    throw new Error('parameters not setted');
  }
  return `${uuid()}_${user.email}`;
}
export function jwtSign(user) {
  const payload = getPayloadForAuth(user);

  const opts = { expiresIn: process.env.EXPIRES_IN };

  return jwt.sign(payload, process.env.SECRET_OR_KEY, opts);
}
