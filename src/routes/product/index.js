'use strict';
const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
// const { authentication } = require('../../auth/authUtils');

//Authentication
// router.use(authentication);
//logout

router.post('', asyncHandler(productController.createProduct));

//query//
/**
 * @desc Get all Drafts for shop
 * @param {number} limit
 * return
 *
 */
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop));
module.exports = router;
