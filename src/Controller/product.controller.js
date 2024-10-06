'use strict';
const productService = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product Successful',
            metadata: await productService.createProduct(req.body.product_type, { ...req.body, product_shop: req.user.userId })
        }).send(res);
    };
}

module.exports = new ProductController();
