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
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'publish product by Shop Successful',
            metadata: await productServiceV2.publishProductByShop({ product_id: req.params.id, product_shop: req.user.userId })
        }).send(res);
    };
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'un publish product by Shop Successful',
            metadata: await productServiceV2.unPublishProductByShop({ product_id: req.params.id, product_shop: req.user.userId })
        }).send(res);
    };

    // query
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await productServiceV2.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res);
    };
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Published success',
            metadata: await productServiceV2.findAllPublishForShop({ product_shop: req.user.userId })
        }).send(res);
    };
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get getListSearchProduct success',
            metadata: await productServiceV2.searchProduct(req.params)
        }).send(res);
    };
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get findAllProducts success',
            metadata: await productServiceV2.findAllProducts(req.query)
        }).send(res);
    };
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get findProduct success',
            metadata: await productServiceV2.findProduct({ product_id: req.params.product_id })
        }).send(res);
    };
}

module.exports = new ProductController();
