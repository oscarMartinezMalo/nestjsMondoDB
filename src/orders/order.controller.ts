import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
// import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
// import { ProductValidationSchema } from "./product-joi.validation";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { Order, OrderItem } from "./order.model";
import { ProductService } from "src/products/products.service";
import * as checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { PaypalPaymentService } from "./paypal-payment/paypal-payment.service";

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private paypalService: PaypalPaymentService) { }

    @Post()
    @UseGuards(new AuthGuard())
    async addProduct(
        @Body() completeBody: Order
    ) {  
        const captureSuccess = await this.paypalService.captureOrder(completeBody.paypalOrderID);     
        if( captureSuccess ) {
            const generatedId = await this.orderService
            .insertOrder(completeBody.userId, completeBody.paypalOrderID, completeBody.shipping, completeBody.datePlaced, completeBody.items);
            return { id: generatedId };
        } else {
            //return an Error;
        }


    }

    @Post('paypal-order')
    @UseGuards(new AuthGuard())
    async getPaypalOrder(
        @Body() completeBody: Order
    ) {
        const resp = await this.paypalService.paypalCheckOut(completeBody);
        return resp;
        // const generatedId = await this.orderService
        // .insertOrder(completeBody.userId, completeBody.shipping, completeBody.datePlaced, completeBody.items);
        // return { id: generatedId };

    }

    @Get('execute-order/:orderId')
    @UseGuards(new AuthGuard())
    async executeOrder(@Param('orderId') orderId: string) {
        console.log(orderId);
        this.paypalService.captureOrder(orderId);
    }

    @Get('by-user')
    @UseGuards(new AuthGuard())
    async getMyOders(@User() user: { id: string, email: string }){      // @Param('userId') userId: string,) {
        const myOders = await this.orderService.getMyOrders(user.id);
        return myOders;
    }

    @Get()
    @UseGuards(new AuthGuard())
    async getAllOrders() {
        const myOders = await this.orderService.getAllOrders();
        return myOders;
    }

    @Get('/by-order-id/:orderId')
    @UseGuards(new AuthGuard())
    async getOrderById(@Param('orderId') orderId: string) {
        const orderDetails = await this.orderService.getOrderById(orderId);
        return orderDetails;
    }

    buildRequestBody() {
    return {
        "intent": "CAPTURE",
        "application_context": {
            "return_url": "https://www.example.com",
            "cancel_url": "https://www.example.com",
            "brand_name": "EXAMPLE INC",
            "locale": "en-US",
            "landing_page": "BILLING",
            "shipping_preference": "SET_PROVIDED_ADDRESS",
            "user_action": "CONTINUE"
        },
        "purchase_units": [
            {
                "reference_id": "PUHF",
                "description": "Sporting Goods",

                "custom_id": "CUST-HighFashions",
                "soft_descriptor": "HighFashions",
                "amount": {
                    "currency_code": "USD",
                    "value": "220.00",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": "180.00"
                        },
                        "shipping": {
                            "currency_code": "USD",
                            "value": "20.00"
                        },
                        "handling": {
                            "currency_code": "USD",
                            "value": "10.00"
                        },
                        "tax_total": {
                            "currency_code": "USD",
                            "value": "20.00"
                        },
                        "shipping_discount": {
                            "currency_code": "USD",
                            "value": "10"
                        }
                    }
                },
                "items": [
                    {
                        "name": "T-Shirt",
                        "description": "Green XL",
                        "sku": "sku01",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "90.00"
                        },
                        "tax": {
                            "currency_code": "USD",
                            "value": "10.00"
                        },
                        "quantity": "1",
                        "category": "PHYSICAL_GOODS"
                    },
                    {
                        "name": "Shoes",
                        "description": "Running, Size 10.5",
                        "sku": "sku02",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "45.00"
                        },
                        "tax": {
                            "currency_code": "USD",
                            "value": "5.00"
                        },
                        "quantity": "2",
                        "category": "PHYSICAL_GOODS"
                    }
                ],
                "shipping": {
                    "method": "United States Postal Service",
                    "name": {
                        "full_name": "John Doe"
                    },
                    "address": {
                        "address_line_1": "123 Townsend St",
                        "address_line_2": "Floor 6",
                        "admin_area_2": "San Francisco",
                        "admin_area_1": "CA",
                        "postal_code": "94107",
                        "country_code": "US"
                    }
                }
            }
        ]
    };
}

}