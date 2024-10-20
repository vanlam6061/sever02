'use strict';

const { product, electronic, clothing, furniture } = require('../product.model');
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product.find(query).populate('product shop', 'name email -_id').sort({ updateAt: -1 }).skip(skip).limit(limit).learn().exec();
};

module.exports = findAllDraftsForShop;
