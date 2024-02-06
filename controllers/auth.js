const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const Token = require("../models/Token");
const CustomError = require('../errors');
const crypto = require('crypto');
const {
  createTokenUser,
  attachTokensToResponse
} = require('../utils');



const register = async (req, res) => {
  const { email, name, password } = req.body;
  
  // check if feild is empty
  if (!email || !password || !name) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }
  // check if email already exist
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }
  // create user data
  const user = await User.create({
    name,
    email,
    password,
  })
  const tokenUser = createTokenUser(user);
  res.status(StatusCodes.CREATED).json({user:tokenUser});
  return;
};

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const tokenUser = createTokenUser(user);
 // create refresh token
 let refreshTokenn = '';
 // check for existing token
 const existingToken = await Token.findOne({ user: user._id });
 if (existingToken) {
   const { isValid } = existingToken;
   if (!isValid) {
     throw new CustomError.UnauthenticatedError('Invalid Credentials');
   }
   refreshTokenn = existingToken.refreshToken;
   const{accessToken, refreshToken} = attachTokensToResponse({ res, user: tokenUser, refreshTokenn });
   res.status(StatusCodes.OK).json({ 
    user: tokenUser,
    tokens:{
      accessToken, 
      refreshToken
    } });
   return;
 }
 refreshTokenn = crypto.randomBytes(40).toString('hex');
const userAgent = req.headers['user-agent'];
const ip = req.ip;
const userToken = { refreshToken: refreshTokenn, ip, userAgent, user: user._id };

await Token.create(userToken);

const {accessTokenJWT, refreshTokenJWT} = attachTokensToResponse({ res, user: tokenUser, refreshToken: refreshTokenn });
res.status(StatusCodes.OK).json({ 
  user: tokenUser,
  tokens:{accessTokenJWT, refreshTokenJWT} 
});
return;
}


const updateUser = async (req, res) => {
  // console.log(req.user);
  // console.log(req.body);
  const { email, name,  } = req.body;
  if (!email || !name ) {
    throw new CustomError.BadRequest('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();
 // const token = user.createJWT();
  res.status(StatusCodes.OK).json({user});
  return;
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  return;
};

module.exports = {
  register,
  login,
  updateUser,
  logout,
}