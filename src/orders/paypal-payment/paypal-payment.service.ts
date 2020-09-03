/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import * as checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { Order } from '../order.model';
import { ProductService } from 'src/products/products.service';


@Injectable()
export class PaypalPaymentService {
    private completeBody: Order;
    private orderId: string;

    constructor(private readonly productService: ProductService,
        // private readonly httpService: HttpService
        ) { }

    async paypalCheckOut(completeBody: Order) {
        this.completeBody = completeBody;

        const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
            'ASFFab1yjnV6n-pKnMLfhURx2O7sHUM8wYBfTztwGP0UH4TuTMDjTk0X2G06XjUFcCatr95BMudLYUB-',
            'EIk0gpDTqIe4E4wuMiOHOG9y0WOp5OAq1R2Ampe3GirlMrUGMueqZk2rlVBY7TD5A4qJG5JnY8pesOe4');
        const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        
        // End This seccion is to process the order in the backend
            // This process the order and gave you a and url for the user approve the order
            // request.requestBody(await this.buildRequestBody());
            // const response = await client.execute(request);

            // if (response.statusCode === 201) {
            //     for (let index = 0; index < response.result.links.length; index++) {
            //         if (response.result.links[index]['rel'] === 'approve')
            //         return { orderId: response.result.id, paypalUrl: response.result.links[index]['href']}
            //     }
            // }
       //// End This seccion is to process the order in the backend
        return await this.buildRequestBody();
    }

    async captureOrder(orderId) {
        const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
            'ASFFab1yjnV6n-pKnMLfhURx2O7sHUM8wYBfTztwGP0UH4TuTMDjTk0X2G06XjUFcCatr95BMudLYUB-',
            'EIk0gpDTqIe4E4wuMiOHOG9y0WOp5OAq1R2Ampe3GirlMrUGMueqZk2rlVBY7TD5A4qJG5JnY8pesOe4');
        const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
        const response = await client.execute(request);
        return response.statusCode === 201 ?  true :  false;

        // const requestt = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
        // const responset = await client.execute(requestt);
        // console.log(responset);
        // if (response.statusCode === 201) {
        //     const respCheckout = new checkoutNodeJssdk.orders.OrdersAuthorizeRequest(orderId);
        //     const responseIt = await client.execute(respCheckout);
        //     console.log(responseIt);
        // }
    }

    async buildRequestBody() {
        // This seccion is to process the order in the backend
        const paypalObj = {
        "intent": "CAPTURE",
            "application_context": {
                "return_url": "http://localhost:4200/order-receipt",
                "cancel_url": "https://www.example.com",
                "brand_name": "EXAMPLE INC",
                "locale": "en-US",
                "landing_page": "BILLING",
                "shipping_preference": "SET_PROVIDED_ADDRESS",
                "user_action": "CONTINUE"
            }, "purchase_units": []
         };
       //// End This seccion is to process the order in the backend

        paypalObj.purchase_units[0] = this.getPurchaseUnitObj();
        const objTest = await this.getItemsList();
        paypalObj.purchase_units[0].items = objTest.itemList;
        paypalObj.purchase_units[0].amount = this.getAmountObj(objTest.itemsTotalTax, objTest.itemsTotalPrice);
        paypalObj.purchase_units[0].shipping = this.getShippingObj();

        return paypalObj;
    }

    private getPurchaseUnitObj() {
        return {
            "reference_id": "PUHF",
            "description": "Sporting Goods",

            "custom_id": "CUST-HighFashions",
            "soft_descriptor": "HighFashions",
            "amount": {},
            "items": [],
            "shipping": {}
        }
    }

    private async getItemsList(): Promise<{ itemList: any[], itemsTotalTax: number, itemsTotalPrice: number }> {
        const itemList = [];
        let itemsTotalTax = 0;
        let itemsTotalPrice = 0;

        for (const item of this.completeBody.items) {
            const itemDB = await this.productService.getSingleProduct(item.product.id);
            const itemTax = Math.ceil(itemDB.price * 0.07);
            itemsTotalTax += itemTax;
            itemsTotalPrice += itemDB.price;

            const newItem = {
                "name": itemDB.title,
                "description": itemDB.title,
                "sku": itemDB.id,
                "unit_amount": {
                    "currency_code": "USD",
                    "value": itemDB.price
                },
                "tax": {
                    "currency_code": "USD",
                    "value": itemTax
                },
                "quantity": item.quantity,
                "category": "PHYSICAL_GOODS"
            };

            itemList.push(newItem);
        };
        return { "itemList": itemList, "itemsTotalTax": itemsTotalTax, "itemsTotalPrice": itemsTotalPrice }
        // return itemList;
    }

    private getAmountObj(itemsTotalTax: number, itemsTotalPrice: number) {
        const totalPrice = itemsTotalPrice + 20 + 10 + itemsTotalTax - 10; 
        return {
            "currency_code": "USD",
            "value": totalPrice,
            "breakdown": {
                "item_total": {
                    "currency_code": "USD",
                    "value": itemsTotalPrice
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
                    "value": itemsTotalTax
                },
                "shipping_discount": {
                    "currency_code": "USD",
                    "value": "10"
                }
            }
        }
    }

    private getShippingObj() {
        return {
            "method": "United States Postal Service",
            "name": {
                "full_name": this.completeBody.shipping.name
            },
            "address": {
                "address_line_1": this.completeBody.shipping.address,
                "address_line_2": this.completeBody.shipping.apartment,
                "admin_area_2": this.completeBody.shipping.city,
                "admin_area_1": this.completeBody.shipping.state,
                "postal_code": this.completeBody.shipping.zipCode,
                "country_code": this.completeBody.shipping.country  // Validate to be a code sample 
            }
        }
    }
}
