const jwt = require('jsonwebtoken');
//const { StatusCodes } = require("http-status-codes");

const createJWT = ({ payload }, expires) => {
  const token = jwt.sign(
    payload, 
    process.env.JWT_SECRET,
    { expiresIn: expires } );
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachTokensToResponse = ({user, refreshTokenn }) => {
  const oneDay = '30d';
  const longerExp = '60d'

  const accessToken = createJWT({ payload: { user }, },oneDay);
  const refreshToken = createJWT({ payload: { user, refreshTokenn } },longerExp);
  return {accessToken, refreshToken}


};

module.exports = {
  createJWT,
  isTokenValid,
  attachTokensToResponse,
};
