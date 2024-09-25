const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true }, // New field for product name
      price: { type: Number, required: true }, // New field for product price
      quantity: { type: Number, required: true },
      subtotal: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  orderedOn: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Cart', cartSchema);
