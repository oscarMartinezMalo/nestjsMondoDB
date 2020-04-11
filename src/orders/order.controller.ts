import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
// import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
// import { ProductValidationSchema } from "./product-joi.validation";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { Order } from "./order.model";

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @UseGuards(new AuthGuard())
    async addProduct(
        @Body() completeBody: Order
    ) {
        const generatedId = await this.orderService
            .insertOrder(completeBody.userId, completeBody.shipping, completeBody.datePlaced, completeBody.items);
        return { id: generatedId };
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

