const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');

// Create new order
const createOrder = asyncHandler(async (req, res) => {
    const{_id} = req.user;
    let {coupon} = req.body;
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price');
    const products = userCart.cart.map((el) =>({
        product: el.product._id,
        count: el.quantity,
        color: el.color,
    }));

    let total = userCart.cart.reduce((sum, el) => sum + el.product.price * el.quantity, 0);
    if(coupon){
        const selectedCoupon = await Coupon.findById(coupon);
        total = Math.round((total - total * selectedCoupon.discount / 100) / 1000) * 1000;
    }

    const newOrder = await Order.create({products, total, orderBy: _id});
    if(!userCart) throw new Error('User not found!');
    
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