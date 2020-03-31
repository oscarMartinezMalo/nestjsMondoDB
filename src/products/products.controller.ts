import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, Header } from "@nestjs/common";
import { ProductService } from "./products.service";
import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
import { ProductValidationSchema } from "./product-joi.validation";

@Controller('products')
export class ProductsController {
    constructor(private readonly productServicer: ProductService) { }

    //Ex. { "title": "oscar", "description": "Martinez", "price": 5 }
    @Post()
    @UsePipes(new JoiValidationPipe(ProductValidationSchema))
    async addProduct(
        // @Body() completeBody: {title: string, description: string, price: number},  // If you want to get whole the body
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number) {

        const generatedId = await this.productServicer.insertProduct(prodTitle, prodDesc, prodPrice);
        return { id: generatedId };
    }

    @Get()
    async getAllProducts(@Body('user') userCredentials: {id: string, email:string}) {
        console.log(userCredentials);        
        const products = await this.productServicer.getProducts();
        return products;
    }

    @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.productServicer.getSingleProduct(prodId);
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number) {
        await this.productServicer.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }

    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        await this.productServicer.deleteProduct(prodId);
        return null;
    }

}