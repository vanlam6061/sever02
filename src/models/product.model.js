'use strict';
const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
        product_name: {
            type: String,
            required: true
        },
        product_thumb: {
            type: String,
            required: true
        },
        product_description: String,

        product_price: {
            type: Number,
            required: true
        },
        product_quantity: {
            type: Number,
            required: true
        },
        product_type: {
            type: String,
            required: true,
            enum: ['Electronics', 'Clothing', 'Furniture']
        },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);

const clothingSchema = new Schema(
    {
        brand: {
            type: String,
            required: true
        },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
    },
    {
        collection: 'clothes',
        timestamps: true
    }
);
const electronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true
        },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
    },
    {
        collection: 'electronics',
        timestamps: true
    }
);
const furnitureSchema = new Schema(
    {
        brand: {
            type: String,
            required: true
        },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
    },
    {
        collection: 'furniture',
        timestamps: true
    }
);
//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronics', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema)
};
