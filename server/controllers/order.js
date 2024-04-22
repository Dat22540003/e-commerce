const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');

// Create new order
const createOrder = asyncHandler(async (req, res) => {
    const{_id} = req.user;
    let {products, total, address, status} = req.body;
    if(address){
        await User.findByIdAndUpdate(_id, {address, cart: []});
    }
    const data = {products, total, orderBy: _id}
    if(status) data.status = status;
    const newOrder = await Order.create(data);
    return res.status(200).json({
        success: newOrder ? true : false,
        createdOrder: newOrder ? newOrder : 'Something went wrong!',
    });
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const{oid} = req.params;
    const {status} = req.body;
    if(!status) throw new Error('Missing inputs!');
    const response = await Order.findByIdAndUpdate(oid, {status}, {new: true});
    
    return res.status(200).json({
        success: response ? true : false,
        updatedOrderStatus: response ? response : 'Something went wrong!',
    });
});

// get user order
const getUserOrder = asyncHandler(async (req, res) => {
    const{_id} = req.user;
    const response = await Order.find({orderBy: _id});
    
    return res.status(200).json({
        success: response ? true : false,
        userOrder: response ? response : 'Something went wrong!',
    });
});

// get all orders
const getOrders = asyncHandler(async (req, res) => {
    const response = await Order.find();
    return res.status(200).json({
        success: response ? true : false,
        userOrder: response ? response : 'Something went wrong!',
    });
});

module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrder,
    getOrders,
};