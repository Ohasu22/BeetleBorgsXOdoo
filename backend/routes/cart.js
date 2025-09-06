// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET /cart - Get user's cart (protected)
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title price images co2Saved isActive')
      .lean();

    if (!cart) {
      cart = {
        user: req.user._id,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        totalCO2Saved: 0
      };
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cart/add - Add item to cart (protected)
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found or unavailable' });
    }

    // Prevent users from adding their own products
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot add your own product to cart' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: parseInt(quantity)
      });
    }

    await cart.save();
    await cart.populate('items.product', 'title price images co2Saved isActive');

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cart/update/:itemId - Update item quantity (protected)
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.itemId;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = parseInt(quantity);
    await cart.save();
    await cart.populate('items.product', 'title price images co2Saved isActive');

    res.json(cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /cart/remove/:itemId - Remove item from cart (protected)
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.remove();
    await cart.save();
    await cart.populate('items.product', 'title price images co2Saved isActive');

    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /cart/clear - Clear entire cart (protected)
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cart/checkout - Process checkout (protected)
router.post('/checkout', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'credit_card', notes = '' } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate all products are still active
    const inactiveProducts = cart.items.filter(item => !item.product.isActive);
    if (inactiveProducts.length > 0) {
      return res.status(400).json({ 
        error: 'Some items in your cart are no longer available',
        inactiveItems: inactiveProducts.map(item => item.product.title)
      });
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      co2Saved: item.product.co2Saved
    }));

    // Create order (this will be handled by order routes)
    const orderData = {
      buyer: req.user._id,
      items: orderItems,
      totalAmount: cart.totalPrice,
      totalCO2Saved: cart.totalCO2Saved,
      shippingAddress,
      paymentMethod,
      notes
    };

    // Clear cart after successful order creation
    cart.items = [];
    await cart.save();

    res.json({
      message: 'Checkout successful',
      orderData,
      totalAmount: cart.totalPrice,
      totalCO2Saved: cart.totalCO2Saved
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
