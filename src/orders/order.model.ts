import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    paypalOrderID: { type: String, required: true },
    datePlaced: { type: String, required: true },
    shipping: { 
        name: { type: String },
        address: { type: String },
        apartment: { type: String },
        city: { type: String },
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
    paypalOrderID?: string;
    userId: string;
    shipping: Shipping;
    datePlaced: string;
    items: OrderItem[];
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