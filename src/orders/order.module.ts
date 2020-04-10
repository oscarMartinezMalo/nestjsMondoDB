import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { OrderSchema } from "./order.model";
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
// import { AuthMiddleware } from "src/middlewares/auth.middleware";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // throw new Error("Method not implemented.");
    }
}
