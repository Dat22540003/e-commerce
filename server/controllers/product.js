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
  const queries = { ...req.query };

  // Separate the specified fields from queries
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queries[el]);

  // Format the queries to be used in mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formattedQueries = JSON.parse(queryString);
  let colorQueryObject = {};

  // Filtering
  if (queries?.title) {
    formattedQueries.title = { $regex: queries.title, $options: "i" };
  }
  if (queries?.category) {
    formattedQueries.category = { $regex: queries.category, $options: "i" };
  }
  if (queries?.color) {
    delete formattedQueries.color;
    const colorArr = queries.color?.split(",");
    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "i" },
    }));
    colorQueryObject = { $or: colorQuery };
  }
  const q = { ...colorQueryObject, ...formattedQueries };
  let queryCommand = Product.find(q);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
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
    const products = await queryCommand.exec();
    if (!products || products.length === 0)
      throw new Error("Cannot get products!");
    const count = await Product.find(q).countDocuments();
    return res.status(200).json({
      success: products ? true : false,
      count,
      productData: products ? products : "Cannot get products!",
    });
  } catch (error) {
    throw new Error(error.message);
  }
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

//
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );

  if (alreadyRating) {
    // Update the rating
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      }
    );
  } else {
    // Add new rating
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }

  // Calculate the total rating
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRating = updatedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRating = Math.round((sumRating * 10) / ratingCount) / 10;
  await updatedProduct.save();

  return res.status(200).json({
    success: true,
    updatedProduct,
  });
});

// Upload images
const uploadProductImages = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.files.length === 0) throw new Error("Missing inputs!");
  const respone = await Product.findByIdAndUpdate(
    pid,
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  return res.status(200).json({
    success: respone ? true : false,
    updatedProductImages: respone ? respone : "Cannot update product images!",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadProductImages,
};
