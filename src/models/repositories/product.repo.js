'use strict';
const { product, electronic, clothing, furniture } = require('../product.model');
const { Types } = require('mongoose');
const { getSelectData, unGetSelectData } = require('../../utils/index');
//

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
};
const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
};
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
        .find(
            {
                isPublished: true,
                $text: { $search: regexSearch }
            },
            { scope: { $meta: 'textScope' } }
        )
        .sort({ scope: { $meta: 'textScope' } })
        .lean();
    return results;
};
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    if (!foundShop) return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.update(foundShop);
    return modifiedCount;
};
const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    if (!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.update(foundShop);
    return modifiedCount;
};
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await product.find(filter).sort(sortBy).limit(limit).skip(skip).select(getSelectData(select)).lean();
    return products;
};
const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect));
};

////////////////////////////////
const queryProduct = async ({ query, limit, skip }) => {
    return await product.findOne(query).populate('product_shop', 'name email -_id').sort({ updateAt: -1 }).skip(skip).limit(limit).lean().exec();
};

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct
};
