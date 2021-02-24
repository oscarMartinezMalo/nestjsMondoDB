import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true},
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

export interface Order extends mongoose.Document {
    id?: string;
    status: string;
    billingAddress: BillingAddress
    paypalOrderID?: string;
    userId: string;
    shipping: Shipping;
    datePlaced: string;
    items: OrderItem[];
}

interface  BillingAddress{
    firstName: string;
    lastName: string;
    streetAddress: string;
    aptSuit: string;
    city: string;
    state: string;
    zipCode: string;
    phone: number;
    email: string;
}

interface Shipping {
    name: string;
    address: string;
    apartment: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
}

export interface OrderItem {
    product: Product;
    quantity: number;
    totalPrice: number;
}

interface Product {
    id?: string;
    title: string;
    price: number;
    imageUrl: string;
}