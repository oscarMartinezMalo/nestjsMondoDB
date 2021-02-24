"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    paypalOrderID: { type: String, required: true },
    datePlaced: { type: String, required: true },
    billingAddress: {
        firstName: String,
        lastName: String,
        streetAddress: String,
        aptSuit: String,
        city: String,
        state: String,
        zipCode: String,
        phone: String,
        email: String,
    },
    shipping: {
        name: { type: String },
        address: { type: String },
        apartment: { type: String },
        zipCode: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
    },
    items: [{
            product: {
                title: { type: String },
                price: { type: Number },
                imageUrl: { type: String },
            },
            quantity: { type: Number, default: 0 },
            totalPrice: { type: Number, default: 0 }
        }]
});
//# sourceMappingURL=order.model.js.map