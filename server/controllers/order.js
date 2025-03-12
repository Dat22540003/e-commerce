const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');

// Create new order
const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    let { products, total, address, status } = req.body;
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
    }
    const data = { products, total, orderBy: _id };
    if (status) data.status = status;
    const newOrder = await Order.create(data);
    return res.status(200).json({
        success: newOrder ? true : false,
        createdOrder: newOrder ? newOrder : 'Something went wrong!',
    });
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) throw new Error('Missing inputs!');
    const response = await Order.findByIdAndUpdate(
        oid,
        { status },
        { new: true },
    );

    return res.status(200).json({
        success: response ? true : false,
        updatedOrderStatus: response ? response : 'Something went wrong!',
    });
});

// get user order
const getUserOrder = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const { _id } = req.user;

    // Separate the specified fields from queries
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queries[el]);

    // Format the queries to be used in mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`,
    );
    const formattedQueries = JSON.parse(queryString);

    const qr = { ...formattedQueries, orderBy: _id };
    let queryCommand = Order.find(qr);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    // - litmit: number of results per API call
    // - skip: number of results to skip
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.PAGINATION_LIMIT;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    // Execute the query
    try {
        const orders = await queryCommand.exec();
        if (!orders || orders.length === 0)
            throw new Error('Cannot get orders!');
        const count = await Order.find(qr).countDocuments();
        return res.status(200).json({
            success: orders ? true : false,
            count,
            order: orders ? orders : 'Cannot get orders!',
        });
    } catch (error) {
        throw new Error(error.message);
    }
});

// get all orders
const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // Separate the specified fields from queries
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queries[el]);

    // Format the queries to be used in mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`,
    );
    const formattedQueries = JSON.parse(queryString);

    const qr = { ...formattedQueries };
    let queryCommand = Order.find(qr);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    // - litmit: number of results per API call
    // - skip: number of results to skip
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.PAGINATION_LIMIT;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    // Execute the query
    try {
        const orders = await queryCommand.exec();
        if (!orders || orders.length === 0)
            throw new Error('Cannot get orders!');
        const count = await Order.find(qr).countDocuments();
        return res.status(200).json({
            success: orders ? true : false,
            count,
            order: orders ? orders : 'Cannot get orders!',
        });
    } catch (error) {
        throw new Error(error.message);
    }
});

module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrder,
    getOrders,
};
