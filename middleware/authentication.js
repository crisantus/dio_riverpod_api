const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');
const Token = require('../models/Token')

const authenticateUser = async (req, res, next) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  else if(token === undefined){
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
  // check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
  const payload = isTokenValid(token);
  try {
    // once token is invalid flag error it will be catch in try and catch
    //const payload = isTokenValid(token);
    // once token is deleted flag error it will be catch in try and catch
    const checkToken = await Token.findOne({user:payload.user.userId})
    if(!checkToken){
      throw new CustomError.UnauthenticatedError('Expired session, Login again');
    }
    
    // Attach the user and his permissions to the req object
    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };

    next();
  } catch (error) {
    console.log(error);
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
