import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderItem } from "./order.model";

@Injectable()
export class OrderService {
    constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { }

    async insertOrder(userId, shipping, datePlaced: string, items: any) {
       const newOrder = new this.orderModel({userId, shipping, datePlaced, items});
       const result = await newOrder.save();
       return result.id as string;
    }
}