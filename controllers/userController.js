const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachTokensToResponse,
  checkPermissions,
} = require('../utils');
 

const getAllUsers = async (req, res) => {
     console.log(req.user);
    const users = await User.find().select('-password'); // with this we can remove the passowrd feild
    res.status(StatusCodes.OK).json({ users });
  };

  const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) {
      throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    //checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
  };

const showCurrentUser = async (req, res)=>{
    res.status(StatusCodes.OK).json({user:req.user,})
}


// update user with user.save()
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachTokensToResponse({ res, user: tokenUser, refreshTokenn });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res)=>{
  const {oldPassword, newPassword} = req.body;
  if(!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values")
  }
  const user = await User.findOne({_id:req.user.userId});
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if(!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials")
  }
  user.password = newPassword;
  user.save();
  res.status(StatusCodes.OK).json({msg: "Success! Password updated"})
   
}

module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword,}


