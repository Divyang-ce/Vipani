const Wishlist = require("../models/Whislist");
const Product = require("../models/Product");

const addToWishlist = async (req, res) => {
  try {

    const product = await Product.findById(
      req.params.productId
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {

      wishlist = await Wishlist.create({
        user: req.user.userId,
        products: [],
      });

    }

    const exists = wishlist.products.find(
      (id) =>
        id.toString() ===
        req.params.productId
    );

    if (exists) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    wishlist.products.push(
      req.params.productId
    );

    await wishlist.save();

    return res.status(200).json({
      message: "Added to wishlist",
      wishlist,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

const getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    }).populate("products");

    if (!wishlist) {
      return res.status(200).json({
        products: [],
      });
    }

    return res.status(200).json(wishlist);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

const removeFromWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (productId) =>
        productId.toString() !==
        req.params.productId
    );

    await wishlist.save();

    return res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {addToWishlist, getWishlist, removeFromWishlist}