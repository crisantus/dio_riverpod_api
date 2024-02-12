
const Token = require("../models/Token");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  isTokenValid,
  createTokenUser,
  attachTokensToResponse,
} = require('../utils');
const CustomError = require('../errors');


const newRefreshToken = async (req, res) => {
    const { refresh_Token } = req.body;

    if (!refresh_Token ) {
      throw new CustomError.BadRequestError("Please provide token");
    }
    const payload = isTokenValid(refresh_Token);
   // console.log(payload)
       //check if the user exist 
       const user = await User.findOne({_id: payload.user.userId})
       if(!user){
        throw new CustomError.BadRequestError("User does not exit");
       }
       // check for existing token
       const existingToken = await Token.findOne({ user: payload.user.userId });
       if (existingToken) {
         const { isValid } = existingToken;
         if (!isValid) {
           throw new CustomError.UnauthenticatedError('Invalid Credentials');
         }
         const tokenUser = createTokenUser(user);
        const  refreshTokenn = existingToken.refreshToken;
        const{accessToken, refreshToken} = attachTokensToResponse({ user: tokenUser, refreshTokenn });
         res.status(StatusCodes.OK).json({ user: tokenUser,tokens:{accessToken, refreshToken} });
         return;
       }else{
        throw new CustomError.UnauthenticatedError('Unathorized, please login');
       }
      
  };
  


  module.exports = { newRefreshToken  };