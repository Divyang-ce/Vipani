const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      // image,
    } = req.body;

    // Required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "All required fields are required",
      });
    }

    // Price validation
    if (price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    // Stock validation
    if (stock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    // Image from multer
    const image = req.file
      ? [req.file.filename]
      : [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const getProducts = async (req, res) => {
  try {

    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 5,
      sort,
    } = req.query;

    const filter = {};

    // Search
    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Category Filter
    if (category) {
      filter.category = category;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    }

    if (sort === "price_desc") {
      sortOption.price = -1;
    }

    if (sort === "newest") {
      sortOption.createdAt = -1;
    }

    if (sort === "oldest") {
      sortOption.createdAt = 1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts =
      await Product.countDocuments(filter);

    const totalPages = Math.ceil(
      totalProducts / Number(limit)
    );

    return res.status(200).json({
      totalProducts,
      currentPage: Number(page),
      totalPages,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
      products,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};


const getProductsById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("reviews.user", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

const updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

const addReview = async (req, res) => {
  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (review) =>
          review.user.toString() ===
          req.user.userId
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "You already reviewed this product",
      });
    }

    const review = {
      user: req.user.userId,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews =
      product.reviews.length;

    product.averageRating =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    return res.status(201).json({
      message:
        "Review added successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct,
  addReview
};