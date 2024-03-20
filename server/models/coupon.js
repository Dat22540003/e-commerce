const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    expiry:{
        type:Date,
        required:true,
    },
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);