const express = require('express');
const router = express.Router();

const { newRefreshToken  } = require('../controllers/refreshToken');

router.post('/refresh-token', newRefreshToken)

module.exports = router;