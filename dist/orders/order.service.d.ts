import { Model } from "mongoose";
import { Order } from "./order.model";
export declare class OrderService {
    private readonly orderModel;
    constructor(orderModel: Model<Order>);
    insertOrder(userId: string, paypalOrderID: any, shipping: any, datePlaced: string, items: any): Promise<string>;
    getMyOrders(userId: string): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
    getOrderById(orderId: string): Promise<Order>;
}
