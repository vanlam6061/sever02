'use strict';
const { getSelectData, unGetSelectData } = require('../../utils/index');

const findAllDiscountCodesUnSelect = async ({ limit = 50, sort = 'ctime', page = 1, filter, unSelect, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = await model.find(filter).sort(sortBy).limit(limit).skip(skip).select(unGetSelectData(unSelect)).lean();
    return documents;
};
const findAllDiscountCodesSelect = async ({ limit = 50, sort = 'ctime', page = 1, filter, select, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = await model.find(filter).sort(sortBy).limit(limit).skip(skip).select(getSelectData(select)).lean();
    return documents;
};
module.exports = { findAllDiscountCodesUnSelect, findAllDiscountCodesSelect };
