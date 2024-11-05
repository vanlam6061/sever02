'use strict';
const { Schema, model } = require('mongoose'); // Erase if already required
const slugify = require('slugify');
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ['active', 'completed', 'failed', 'pending'],
            default: 'active'
        },
        cart_products: {
            type: Array,
            required: true,
            default: []
        },
        cart_count_products: { type: Number, default: 0 },
        cart_UserId: { type: Number, default: true }
    },
    {
        collection: COLLECTION_NAME,
        timeseries: {
            createdAt: 'createdOn',
            updatedAt: 'updatedOn'
        }
    }
);

//Export the model
module.exports = {
    cart: model(DOCUMENT_NAME, cartSchemaSchema)
};
