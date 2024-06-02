const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        min: 3
    },
    product: {
        type: String,
        required: [true, 'Product name is required'],
        maxlength: [30, 'Product name must be 30 characters or less']
    },
    tags: {
        type: [String],
        validate: [
            { validator: tagLimit, message: 'You can only have up to 3 tags' },
            { validator: validateTags, message: 'Tags can only contain letters, numbers, hiragana, katakana, and kanji' },
            { validator: validateUniqueTags, message: 'Tags must be unique' },
            { validator: tagLength, message: 'Tags must be 25 characters or less' }
        ],
        default: [] // デフォルト値を空の配列に設定
    },
    desc: {
        type: String,
        validate: {
            validator: descValidator,
            message: 'Description must be 200 half-width characters or 100 full-width characters or less'
        },
        required: false // Description is optional
    },
    isSale: {
        type: Boolean,
        required: true,
        default: false
    },
    currency: {
        type: String,
        required: true,
        enum: ['$', '¥', '€', '£'] // Limit the types of currency
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    storeName: { 
        type: String, 
        maxlength: [30, 'Store name must be 30 characters or less'],
        required: false // Store name is optional
    }, 
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false // Image is not required
    },
}, { timestamps: true });

// Helper function to validate the number of tags
function tagLimit(val) {
    return val.length <= 3;
}

// Validate that each tag meets the specified criteria
function validateTags(val) {
    return val.every(tag => /^[a-zA-Z0-9ぁ-ゔァ-ヴー々〆〤一-龥]+$/.test(tag));
}

// Validate that each tag is unique within the array
function validateUniqueTags(val) {
    const uniqueTags = new Set(val);
    return uniqueTags.size === val.length;
}

// Validate that each tag is 25 characters or less
function tagLength(val) {
    return val.every(tag => tag.length <= 25);
}

// Validate description length
function descValidator(val) {
    const halfWidth = val.replace(/[^\x00-\x7F]/g, '').length; // Count half-width characters
    const fullWidth = val.length - halfWidth; // Count full-width characters
    return halfWidth <= 200 && fullWidth <= 100;
}

module.exports = mongoose.model("Pin", PinSchema);