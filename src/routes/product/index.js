'use strict';
const express = require('express');
const productController = require('../../controllers/product.controller.js');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
// const { authentication } = require('../../auth/authUtils');

//Authentication
// router.use(authentication);
//logout

router.post('', asyncHandler(productController.createProduct));
module.exports = router;
