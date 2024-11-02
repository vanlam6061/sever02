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
        //
        discount_code: { type: String, required: true }, //discount code
        discount_start_date: { type: Date, required: true }, // ngày bắt đầu
        discount_end_date: { type: Date, required: true }, //ngày kết thúc
        //
        discount_max_uses: { type: Number, required: true }, // số lượng discount được áp dụng
        discount_uses_count: { type: Number, required: true }, // số discount đã sử dụng
        discount_user_use: { type: Array, default: [] }, // ai đã sử dụng,
        //
        discount_max_user_per_use: { type: Number, required: true }, // số lượng cho phép tối đa user được dử dụng mỗi lần dùng
        discount_min_order_value: { type: Number, required: true },
        discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
        //
        discount_is_active: { type: Boolean, default: true },
        discount_applies_to: { type: String, required: true, enum: ['All', 'Specific'] },
        discount_productIds: { type: Array, default: [] }

        //
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
