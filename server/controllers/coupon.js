const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

// Create new coupon category
const createCoupon = asyncHandler(async (req, res) => {
    const {name, discount, expiry} = req.body;
    if (!name || !discount || !expiry) {
        throw new Error("Missing inputs!");
    }
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new coupon category!',
    });
});

// Get all coupon category
const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-updatedAt -createdAt');
    return res.status(200).json({
        success: response ? true : false,
        Coupons: response ? response : 'Cannot get coupons!',
    });
});

// Update Coupon category
const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs!');
    if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update coupon!',
    });
});

// Delete Coupon category
const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete coupon!',
    });
});

module.exports = { 
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};
