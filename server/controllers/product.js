const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// Create new product
const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing inputs");
  }
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.create(req.body);
  return res.status(200).json({
    success: product ? true : false,
    createdProduct: product ? product : "Cannot create new product!",
  });
});

// Get product
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product!",
  });
});

// Get all product filtering, sorting, and paginating
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  return res.status(200).json({
    success: products ? true : false,
    productData: products ? products : "Cannot get products!",
  });
});

//  Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const product = await Product.findByIdAndUpdate(pid, req.body, { new: true });
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot update products!",
  });
});

//  Update product
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: product ? true : false,
    deletedData: product ? product : "Cannot delete products!",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
