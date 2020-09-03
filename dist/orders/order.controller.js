"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const auth_guard_1 = require("../guards/auth.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const products_service_1 = require("../products/products.service");
const paypal_payment_service_1 = require("./paypal-payment/paypal-payment.service");
let OrderController = class OrderController {
    constructor(orderService, productService, paypalService) {
        this.orderService = orderService;
        this.productService = productService;
        this.paypalService = paypalService;
    }
    async addProduct(completeBody) {
        const captureSuccess = await this.paypalService.captureOrder(completeBody.paypalOrderID);
        if (captureSuccess) {
            const generatedId = await this.orderService
                .insertOrder(completeBody.userId, completeBody.paypalOrderID, completeBody.shipping, completeBody.datePlaced, completeBody.items);
            return { id: generatedId };
        }
        else {
        }
    }
    async getPaypalOrder(completeBody) {
        const resp = await this.paypalService.paypalCheckOut(completeBody);
        return resp;
    }
    async executeOrder(orderId) {
        console.log(orderId);
        this.paypalService.captureOrder(orderId);
    }
    async getMyOders(user) {
        const myOders = await this.orderService.getMyOrders(user.id);
        return myOders;
    }
    async getAllOrders() {
        const myOders = await this.orderService.getAllOrders();
        return myOders;
    }
    async getOrderById(orderId) {
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
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(new auth_guard_1.AuthGuard()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addProduct", null);
__decorate([
    common_1.Post('paypal-order'),
    common_1.UseGuards(new auth_guard_1.AuthGuard()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getPaypalOrder", null);
__decorate([
    common_1.Get('execute-order/:orderId'),
    common_1.UseGuards(new auth_guard_1.AuthGuard()),
    __param(0, common_1.Param('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "executeOrder", null);
__decorate([
    common_1.Get('by-user'),
    common_1.UseGuards(new auth_guard_1.AuthGuard()),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getMyOders", null);
__decorate([
    common_1.Get(),
    common_1.UseGuards(new auth_guard_1.AuthGuard()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllOrders", null);
__decorate([
    common_1.Get('/by-order-id/:orderId'),
    common_1.UseGuards(new auth_guard_1.AuthGuard()),
    __param(0, common_1.Param('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
OrderController = __decorate([
    common_1.Controller('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        products_service_1.ProductService,
        paypal_payment_service_1.PaypalPaymentService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map