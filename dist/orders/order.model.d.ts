import * as mongoose from 'mongoose';
export declare const OrderSchema: mongoose.Schema<any>;
export interface Order extends mongoose.Document {
    id?: string;
    status: string;
    billingAddress: BillingAddress;
    paypalOrderID?: string;
    userId: string;
    shipping: Shipping;
    datePlaced: string;
    items: OrderItem[];
}
interface BillingAddress {
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
export {};
