const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.userId,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "cart is empty",
            });
        }

        let totalAmount = 0;

        const orderItems = cart.items.map((item) => {

            totalAmount +=
                item.product.price * item.quantity;

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            };
        });

        const order = await Order.create({
            user: req.user.userId,
            items: orderItems,
            totalAmount,
        });

        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "order placed successfully",
            order,
        });
    }
    catch(error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getMyOrders = async ( req, res) => {
    try{
        const orders = await Order.find({
            user: req.user.userId,
        })
        .populate("items.product")
        .sort({ createdAt: -1});

        return res.status(200).json(orders);

    } catch(error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getOrderById = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)
            .populate("items.product")

        if(!order){
            return res.status(404).json({
                message: " order not found",
            });
        } 
        
        // security check
        if(
            order.user.toString() !== req.user.userId &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "access denied",
            });
        }

        return res.status(200).json(order);

    } catch(error){
        return res.status(500).json({
            message: error.message,
        })
    }
};

const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt : -1});

        return res.status(200).json(orders);

    }catch(error){
        return res.status(500).json({
            message: error.message,
        })
    }
}

const updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      message: "Order status updated",
      order,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    
};