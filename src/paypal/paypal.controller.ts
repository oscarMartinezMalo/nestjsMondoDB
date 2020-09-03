import { Controller, Get, Req } from '@nestjs/common';
import { PaypalPaymentService } from 'src/orders/paypal-payment/paypal-payment.service';

@Controller('paypal')
export class PaypalController {
    constructor(
        // private httpService: HttpService,
        private paypalService: PaypalPaymentService
        ) {}

    CLIENT ='AUJoKVGO3q1WA1tGgAKRdY6qx0qQNIQ6vl6D3k7y64T4qh5WozIQ7V3dl3iusw5BwXYg_T5FzLCRguP8';
    SECRET ='EOw8LNwDhM7esrQ3nHfzKc7xiWnJc83Eawln4YLfUgivfx1LGzu9Mj0F5wlarilXDqdK9Q5aHVo-VGjJ';
    PAYPAL_API = 'https://api.sandbox.paypal.com';

    @Get('success')
    async getMyOders(@Req() req) { 
        console.log(req);
        const payerID  = req.query.PayerID;
        const token = req.query.token;

        //  this.paypalService.captureOrder(payerID, token);
        // const datd = this.httpService.get(`https://api.sandbox.paypal.com/v2/payments/authorizations/${payerID}`).toPromise();

    }
}
