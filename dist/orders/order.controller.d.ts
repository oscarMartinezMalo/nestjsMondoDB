import { OrderService } from "./order.service";
import { Order } from "./order.model";
import { ProductService } from "src/products/products.service";
import { PaypalPaymentService } from "./paypal-payment/paypal-payment.service";
export declare class OrderController {
    private readonly orderService;
    private readonly productService;
    private paypalService;
    constructor(orderService: OrderService, productService: ProductService, paypalService: PaypalPaymentService);
    addProduct(completeBody: Order): Promise<{
        id: string;
    }>;
    getPaypalOrder(completeBody: Order): Promise<{
        intent: string;
        application_context: {
            return_url: string;
            cancel_url: string;
            brand_name: string;
            locale: string;
            landing_page: string;
            shipping_preference: string;
            user_action: string;
        };
        purchase_units: any[];
    }>;
    executeOrder(orderId: string): Promise<void>;
    getMyOders(user: {
        id: string;
        email: string;
    }): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
    getOrderById(orderId: string): Promise<Order>;
    buildRequestBody(): {
        intent: string;
        application_context: {
            return_url: string;
            cancel_url: string;
            brand_name: string;
            locale: string;
            landing_page: string;
            shipping_preference: string;
            user_action: string;
        };
        purchase_units: {
            reference_id: string;
            description: string;
            custom_id: string;
            soft_descriptor: string;
            amount: {
                currency_code: string;
                value: string;
                breakdown: {
                    item_total: {
                        currency_code: string;
                        value: string;
                    };
                    shipping: {
                        currency_code: string;
                        value: string;
                    };
                    handling: {
                        currency_code: string;
                        value: string;
                    };
                    tax_total: {
                        currency_code: string;
                        value: string;
                    };
                    shipping_discount: {
                        currency_code: string;
                        value: string;
                    };
                };
            };
            items: {
                name: string;
                description: string;
                sku: string;
                unit_amount: {
                    currency_code: string;
                    value: string;
                };
                tax: {
                    currency_code: string;
                    value: string;
                };
                quantity: string;
                category: string;
            }[];
            shipping: {
                method: string;
                name: {
                    full_name: string;
                };
                address: {
                    address_line_1: string;
                    address_line_2: string;
                    admin_area_2: string;
                    admin_area_1: string;
                    postal_code: string;
                    country_code: string;
                };
            };
        }[];
    };
}
