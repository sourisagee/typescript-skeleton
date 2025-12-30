const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

function generateJwtTokens(payload) {
  return {
    accessToken: jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, jwtConfig.access),
    refreshToken: jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, jwtConfig.refresh),
  };
}

module.exports = generateJwtTokens;
