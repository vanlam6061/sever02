'use strict';
const { Schema, model } = require('mongoose'); // Erase if already required
const slugify = require('slugify');
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
        product_slug: String,
<<<<<<< HEAD
=======

>>>>>>> 532fe9d522a25f454d5cff3b47c467e862a41151
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
        },
<<<<<<< HEAD
        product_ratingsAverage: {
=======
        //more
        product_ratingsAveraged: {
>>>>>>> 532fe9d522a25f454d5cff3b47c467e862a41151
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be under 5.0'],
            set: (val) => Math.round(val * 10) / 10
<<<<<<< HEAD
        }
=======
        },
        product_variation: { type: Array, default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false }
>>>>>>> 532fe9d522a25f454d5cff3b47c467e862a41151
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});
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
