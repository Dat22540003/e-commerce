const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

// Create new coupon category
const createCoupon = asyncHandler(async (req, res) => {
    const {title, discount, expiry} = req.body;
    if (!title || !discount || !expiry) {
        throw new Error("Missing inputs!");
    }
    const response = await Coupon.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new coupon category!',
    });
});

// Get all coupon category
const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find();
    return res.status(200).json({
        success: response ? true : false,
        Coupons: response ? response : 'Cannot get Coupon categories!',
    });
});

// Update Coupon category
const updateCoupon = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Coupon.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update Coupon category!',
    });
});

// Delete Coupon category
const deleteCoupon = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Coupon.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete Coupon category!',
    });
});

module.exports = { 
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};
