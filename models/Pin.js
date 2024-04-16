const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3
    },
    product: {
        type: String,
        require: true,
        min:3
    },
    tags: {
        type: [String],
        validate: [
            { validator: tagLimit, message: '{PATH} exceeds the limit of 5' },
            { validator: validateTags, message: '{PATH} must only contain uppercase alphabets' },
            { validator: validateUniqueTags, message: '{PATH} must contain only unique tags' }
        ]
    },
    desc: {
        type: String,
        require: true,
        min: 3
    },
    price:{
        type: Number,
        require: true,
        min: 0,
    },
    lat:{
        type: Number,
        require: true,
    },
    long:{
        type: Number,
        require: true,
    },
},{ timestamps: true }
);

// Helper function to validate the number of tags
// val.length <= 5 will be true or false depends on the val below 
function tagLimit(val) {
    return val.length <= 5;
}

// Validate that each tag contains only uppercase alphabets
function validateTags(val) {
    return val.every(tag => /^[A-Z]+$/.test(tag));
}

// Validate that each tag is unique within the array
function validateUniqueTags(val) {
    const uniqueTags = new Set(val);
    return uniqueTags.size === val.length;
}

module.exports = mongoose.model("Pin",PinSchema);