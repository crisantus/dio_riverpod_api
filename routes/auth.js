const express = require('express')
const router = express.Router()
const {  authenticateUser, authorizeRoles,} = require('../middleware/authentication')
const { register,login,updateUser,logout } = require('../controllers/auth')


router.post('/register', register)
router.post('/login', login)
router.patch('/updateUser',authenticateUser,updateUser)
router.post('/logout',authenticateUser, logout);


module.exports = router;
