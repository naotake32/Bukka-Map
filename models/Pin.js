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
module.exports = mongoose.model("Pin",PinSchema);