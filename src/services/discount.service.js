'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const discount = require('../models/discount.model');
const { findAllDiscountCodesSelect, findAllDiscountCodesUnSelect, checkDiscountExits } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const convertToObjectMongodb = require('../utils/index');
/*
1 .- Generator Discount voucher [Shop|Admin]
2. - Get discount amount [User]
3. - Get all discount codes [User |Shop]
 4 - verify discount code [User]
 5. Delete discount Code [Admin | Shop]
 6. - Cancel discount Code [User]

*/

class DiscountService {
    //1. create new discount code by ShopId
    static async createDiscountCode(payload) {
        const {
            name,
            description,
            type,
            code,
            value,
            min_order_value,
            max_value,
            start_date,
            end_date,
            max_uses,
            uses_count,
            users_used,
            shopId,
            max_uses_per_user,
            is_active,
            applies_to,
            product_ids
        } = payload;
        // kiểm tra hết hạn discount
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) throw new BadRequestError(`Discount code has expired`);
        // create index for discount code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectMongodb(shopId)
            })
            .lean();
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError(`Discount already active`);
        }
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            //
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            //
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            //
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        });
        return newDiscount;
    }
    static async updateDiscount() {
        //...
    }

    /*
    Get all discount codes available with products
    */
    static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
        //create index for discount_code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectMongodb(shopId)
            })
            .lean();
        if (!foundDiscount || foundDiscount.discount_is_active) {
            throw new NotFoundError('discount not exits !');
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === 'All') {
            // get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }
        if (discount_applies_to === 'Specific') {
            // get all Specific
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }
        return products;
    }
    /*
    Get list discount_codes  by shopId
    */
    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        });
        return discounts;
    }
    /*
    Get discount_code amount
    */
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExits({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectMongodb(shopId)
            }
        });
        if (!foundDiscount) {
            throw new NotFoundError(`Discount not exist!`);
        }
        const {
            discount_is_active,
            discount_max_uses,
            discount_end_date,
            discount_start_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_value
        } = foundDiscount;
        if (!discount_is_active) throw new NotFoundError(`discount expired!`);
        if (discount_max_uses) throw new NotFoundError(`discount are out!`);
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError(`discount is overdue !`);
        }
        // check xem discount có giá trị tối thiểu không
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + products.quantity * product.price;
            }, 0);
            if (totalOrder < discount_min_order_value) throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`);
        }
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find((user) => user.userId === userId);
            if (userUserDiscount) throw new NotFoundError(`discount.....`);
        }
        // check xem cái discount này là fixed amount hay percentage amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        };
    }
    /*
    5. Delete discount Code [Admin | Shop]
    */
    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectMongodb(shopId)
        });
        return deleted;
    }
    /*
    5. Delete discount Code [Admin | Shop]
    */
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExits({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectMongodb(shopId)
            }
        });
        if (!foundDiscount) {
            throw new NotFoundError('Discount is not exists');
        }
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        });
        return result;
    }
}
module.exports = DiscountService;
