const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        company: String,
        address: { type: String, required: true },
        address2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        total: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    discount: {
        amount: { type: Number, default: 0 },
        couponCode: String
    },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery', 'card', 'upi'],
        default: 'cash_on_delivery'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderNotes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware for order number
OrderSchema.pre('save', function(next) {
    if (this.isNew && !this.orderNumber) {
        const date = new Date();
        const timestamp = date.getTime().toString().slice(-8);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD-${timestamp}${random}`;
    }
    this.updatedAt = new Date();
    next();
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;

// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   orderNumber: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
//   customer: {
//     customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // optional link
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     zipCode: { type: String, required: true },
//     country: { type: String, default: "India" }
//   },
//   items: [{
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     total: { type: Number, required: true }
//   }],
//     subtotal: { type: Number, required: true },
//   shipping: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 }, // Make sure this exists
//   total: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   paymentMethod: { type: String, default: 'cash_on_delivery' },
//   paymentStatus: { 
//     type: String, 
//     enum: ['pending', 'paid', 'failed'],
//     default: 'pending'
//   },
//   notes: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Pre-save hook for order number and timestamp
// orderSchema.pre('save', function(next) {
//   if (this.isNew) {
//     const timestamp = Date.now().toString();
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     this.orderNumber = 'ORD' + timestamp.slice(-8) + random;
//   }
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model("Order", orderSchema);
