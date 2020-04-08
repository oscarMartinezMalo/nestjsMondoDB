import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes} from "@nestjs/common";
import { CartService } from "./cart.service";
import { Cart } from "./cart.model";
import { Product } from "src/products/product.model";

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get('create')
    async addCart() {
        const cartId = await this.cartService.createEmptyCart();
        return {id: cartId};
    }

    @Get(':id')
    async getCart(
        @Param('id') cartId: string
    ) {
        const cart = await this.cartService.getCartById(cartId);
        return cart ;
    }


    @Post('update-item-quantity')
    async getItemToCard(
        @Body('cartId') cartId: string,
        @Body('product') product: Product,
        @Body('change') change: number,
    ) {
        const cart = await this.cartService.addProductToCard(cartId, product, change);
        return cart;
    }

    // @Post()
    // async addProductToCart(
    //     @Body('cartId') cartId: string,
    //     @Body('product') product: Product,
    // ) {
    //     const generatedId = await this.cartService.addOrUpdateProductFromCart(cartId, product);
    //     return { id: generatedId };
    // }

    // @Get()
    // async getAllProducts(
    // ) {
    //     const products = await this.cartService.getProducts();
    //     return products;
    // }

    // @Get(':id')
    // getProduct(@Param('id') prodId: string) {
    //     return this.cartService.getSingleProduct(prodId);
    // }

    // @Patch(':id')
    // async updateProduct(
    //     @Param('id') prodId: string,
    //     @Body('title') prodTitle: string,
    //     @Body('price') prodPrice: number,
    //     @Body('category') prodCategory: string,
    //     @Body('imageUrl') prodImageUrl: string,
    // ) {
    //     await this.cartService.updateProduct(prodId, prodTitle, prodPrice, prodCategory, prodImageUrl);
    //     return null;
    // }


    // @Delete(':id')
    // async removeProduct(@Param('id') prodId: string) {
    //     await this.cartService.deleteProduct(prodId);
    //     return null;
    // }

}