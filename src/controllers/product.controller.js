'use strict';
const productService = require('../services/product.service');
const productServiceV2 = require('../services/product.service.xxx');
const { SuccessResponse } = require('../core/success.response');

// class ProductController {
//     createProduct = async (req, res, next) => {
//         new SuccessResponse({
//             message: 'Create new product Successful',
//             metadata: await productService.createProduct(req.body.product_type, { ...req.body, product_shop: req.user.userId })
//         }).send(res);
//     };
// }
class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product Successful',
            metadata: await productServiceV2.createProduct(req.body.product_type, { ...req.body, product_shop: req.user.userId })
        }).send(res);
    };
    // query
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success',
            metadata: await productServiceV2.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res);
    };
}

module.exports = new ProductController();
