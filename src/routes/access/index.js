'use strict';
const express = require('express');
const accessController = require('../../Controller/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

// Handle error

// Sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

//Authentication
router.use(authentication);
//logout

router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handlerRefreshToken));
module.exports = router;
