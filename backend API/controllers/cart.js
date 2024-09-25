const Cart = require("../models/Cart");
const Product = require('../models/Product'); 
const auth = require("../auth");
const { errorHandler } = auth;

module.exports.addToCart = async (req, res) => { 
    if (req.user.isAdmin) {
        return res.status(403).send({ message: 'Admin is forbidden' });
    }

    try {
        const cartItems = req.body.cartItems;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).send({ message: 'No products provided' });
        }

        // Fetch products with quantity included
        const productIds = cartItems.map(item => item.productId);
        const products = await Product.find({ '_id': { $in: productIds } });

        if (products.length === 0) {
            return res.status(404).send({ message: 'No products found' });
        }

        // Map products to cart items
        const updatedCartItems = products.map(product => {
            const cartItem = cartItems.find(item => item.productId.toString() === product._id.toString());
            return {
                productId: product._id,
                productName: product.name, // Add product name
                quantity: cartItem.quantity,
                subtotal: product.price * cartItem.quantity,
                price: product.price // Add product price
            };
        });

        // Find or create a new cart
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, cartItems: [], totalPrice: 0 });
        }

        // Merge new items with existing cart items
        updatedCartItems.forEach(newItem => {
            const existingItem = cart.cartItems.find(item => item.productId.toString() === newItem.productId.toString());

            if (existingItem) {
                // Update quantity and subtotal if item already exists
                existingItem.quantity += newItem.quantity;
                existingItem.subtotal += newItem.subtotal;
            } else {
                // Add new item if it doesn't exist in the cart
                cart.cartItems.push(newItem);
            }
        });

        // Recalculate total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        const savedCart = await cart.save();
        return res.status(201).send({
            success: true,
            message: 'Items added to cart successfully',
            cart: savedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getCart = (req, res) => {
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (cart) {
                return res.status(200).send({ cart });
            }
            return res.status(404).send({ message: 'Cart is empty' });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.user.id;

        if (!itemId || quantity === undefined || quantity <= 0) {
            return res.status(400).send({ message: 'Valid item ID and positive quantity are required.' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found.' });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).send({ message: 'Item not found in cart.' });
        }

        const item = cart.cartItems[itemIndex];

        // Fetch the product's price from the database
        const product = await Product.findById(item.productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found.' });
        }

        // Update the quantity and calculate the subtotal
        item.quantity = quantity;
        item.subtotal = product.price * quantity; // Calculate subtotal

        // Recalculate total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: 'Item quantity updated successfully.',
            updatedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.removeFromCart = async (req, res) => {
    try {
        if (!req.user || req.user.isAdmin) {
            return res.status(403).send({ message: 'Access forbidden for admin users.' });
        }

        const { productId } = req.params;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).send({ message: 'Product ID is required.' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found.' });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).send({ message: 'Item not found in cart.' });
        }

        // Remove the item from the cart
        const removedItem = cart.cartItems[itemIndex];
        cart.cartItems.splice(itemIndex, 1);

        // Recalculate total price after removing the item
        cart.totalPrice -= removedItem.subtotal; // Adjust total price directly

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: 'Item removed from cart successfully.',
            totalPrice: updatedCart.totalPrice,
            updatedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        if (!req.user || req.user.isAdmin) {
            return res.status(403).send({ message: 'Access forbidden for admin users.' });
        }

        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found.' });
        }

        cart.cartItems = [];
        cart.totalPrice = 0;

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: 'Cart cleared successfully.',
            cart: updatedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
