import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { CartModule } from './shopping-carts/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { CategoryModule } from './categories/category.module';
import { OrderModule } from './orders/order.module';

dotenv.config();

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    AuthModule,
    MongooseModule.forRoot(
      // Enviroment Variable handled through dotenv npm package( file name .env)
      process.env.DB_CONNECT
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
