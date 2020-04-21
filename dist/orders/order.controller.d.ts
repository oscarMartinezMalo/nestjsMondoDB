import { OrderService } from "./order.service";
import { Order } from "./order.model";
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    addProduct(completeBody: Order): Promise<{
        id: string;
    }>;
    getMyOders(user: {
        id: string;
        email: string;
    }): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
    getOrderById(orderId: string): Promise<Order>;
}
