const { OAuth2Client } = require('google-auth-library');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const CLIENT_ID = config.googleClientID;

const client = new OAuth2Client();

const googleAuth = async (req, resolve, reject) => {
  const token = req.headers.authorization;
  if (!token) {
    if (!token) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Token is required'));
    }
  }
  const jwtToken = req.headers.authorization.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: jwtToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = {
      id: payload.sub,
      email: payload.email,
    };
    resolve(null, user, null);
  } catch (error) {
    reject(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
  }
};

module.exports = {
  googleAuth,
};
