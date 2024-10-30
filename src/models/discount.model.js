'use strict';
const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';
// Declare the Schema of the Mongo model
const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_type: { type: String, required: true }, // percentage
        discount_value: { type: Number, required: true }, //10000...
        discount_code: { type: String, required: true }, //discount code
        discount_start_date: { type: Date, required: true }, // ngày bắt đầu
        discount_end_date: { type: Date, required: true }, //ngày kết thúc
        discount_max_uses: { type: Number, required: true }, // số lượng discount được áp dụng
        discount_uses_count: { type: Number, required: true } // mỗi user được sử dụng tối đa bao nhiêu discount
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
