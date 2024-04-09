const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async(req, res) => {
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        sucess: newProduct,
        createProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})
const getProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        sucess: product ? true : false,
        createProduct: product ? product : 'Cannot get product'
    })
})
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các operator cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedEl) => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.title) {
        formattedQueries.title = { $regex: queries.title, $options: 'i' };
    }

    // Query the database
    let queryCommand = Product.find(formattedQueries);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    try {
        // Execute the query and await the result
        const response = await queryCommand;

        // Count documents that match the query
        const counts = await Product.countDocuments(formattedQueries);

        // Send response to client
        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : 'Cannot get products',
            counts
        });
    } catch (error) {
        // Handle errors
        console.error('Error querying database:', error.message);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


const updateProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {new: true})
    return res.status(200).json({
        sucess: updatedProduct ? true : false,
        createProduct: updatedProduct  ? updatedProduct  : 'Cannot update product'
    })
})

const deleteProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        sucess: deleteProduct ? true : false,
        createProduct: deleteProduct  ? deleteProduct  : 'Cannot delete product'
    })
})
module.exports = {
    createProduct,
    getProduct,
    getProducts, 
    updateProduct,
    deleteProduct
}