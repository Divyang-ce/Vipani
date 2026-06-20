const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
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

    const keyword = req.query.keyword;

    let products;

    if (keyword) {

      products = await Product.find({
        name: {
          $regex: keyword,
          $options: "i",
        },
      });

    } else {

      products = await Product.find();

    }

    return res.status(200).json({
      count: products.length,
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

    const product = await Product.findById(req.params.id);

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


module.exports = { createProduct , getProducts, getProductsById, updateProduct, deleteProduct};