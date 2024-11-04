'use strict';
const DiscountService = require('../services/discount.service');
const { SuccessResponse } = require('../core/success.response');

class DiscountController {
    //create  discount
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new discount Successful',
            metadata: await DiscountService.createDiscountCode({ ...req.body, shopId: req.user.uerId })
        }).send(res);
    };
    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'getAllDiscountCodeWithProduct Successful',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({ ...req.query, shopId: req.user.uerId })
        }).send(res);
    };
}

module.exports = new DiscountController();
