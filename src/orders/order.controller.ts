import { Controller, Post, Body, Get, Param, UseGuards, BadRequestException } from "@nestjs/common";
import { OrderService } from "./order.service";
// import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
// import { ProductValidationSchema } from "./product-joi.validation";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { Order, OrderItem } from "./order.model";
import { ProductService } from "src/products/products.service";
import * as checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { PaypalPaymentService } from "./paypal-payment.service";

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
        // throw new BadRequestException('There is something wrong with this order');
        // Check if the total ammount front the order is the same as the order ammount
        const captureSuccess = await this.paypalService.captureOrder(completeBody.paypalOrderID); 
        if( captureSuccess ) {
            const generatedId = await this.orderService
            .insertOrder(completeBody.userId, completeBody.paypalOrderID, completeBody.shipping, completeBody.datePlaced, completeBody.items);
            return { orderPaidID: generatedId };

        } else {
            throw new BadRequestException('There is something wrong with this order');
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
}