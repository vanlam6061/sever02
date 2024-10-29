'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

// Query that no need to authenticate
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/: product_id', asyncHandler(productController.findProduct));

//Authentication
router.use(authenticationV2);
/////////////
router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

//query//

router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));
module.exports = router;
