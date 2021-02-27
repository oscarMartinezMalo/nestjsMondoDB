import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { CartModule } from './shopping-carts/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { CategoryModule } from './categories/category.module';
import { OrderModule } from './orders/order.module';
// import { PaypalController } from './paypal/paypal.controller';
import { PaypalPaymentService } from './orders/paypal-payment.service';
import { MailgunModule } from '@nextnm/nestjs-mailgun';
// import * as paypal  from "paypal-rest-sdk";
// import * as paypal from "@paypal/checkout-server-sdk";
import { MulterModule } from '@nestjs/platform-express';
dotenv.config();

// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': 'ASFFab1yjnV6n-pKnMLfhURx2O7sHUM8wYBfTztwGP0UH4TuTMDjTk0X2G06XjUFcCatr95BMudLYUB-', //App Client ID
//   'client_secret': 'EIk0gpDTqIe4E4wuMiOHOG9y0WOp5OAq1R2Ampe3GirlMrUGMueqZk2rlVBY7TD5A4qJG5JnY8pesOe4' //App Client ID
// });


// This sample uses SandboxEnvironment. In production, use LiveEnvironment


@Module({
  imports: [
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    AuthModule,
    HttpModule,
    MulterModule.register({
      dest: './files',
    }),
    MongooseModule.forRoot(
      // Enviroment Variable handled through dotenv npm package( file name .env)
      process.env.DB_CONNECT
    )],
  controllers: [AppController],
  providers: [AppService, PaypalPaymentService],
})
export class AppModule { }
