import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, Header, UseGuards } from "@nestjs/common";
import { ProductService } from "./products.service";
import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
import { ProductValidationSchema } from "./product-joi.validation";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { Product } from "./product.model";

@Controller('products')
export class ProductsController {
    constructor(private readonly productServicer: ProductService) { }

    @Post()
    @UsePipes(new JoiValidationPipe(ProductValidationSchema))
    @UseGuards(new AuthGuard())
    async addProduct(@Body() completeBody: Product) {
        const generatedId = await this.productServicer.insertProduct(completeBody.title, completeBody.price, completeBody.category, completeBody.imageUrl);
        return { id: generatedId };
    }

    @Get()
    async getAllProducts(
    ) {
        const products = await this.productServicer.getProducts();
        return products;
    }

    @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.productServicer.getSingleProduct(prodId);
    }

    @Patch(':id')
    @UseGuards(new AuthGuard())
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('price') prodPrice: number,
        @Body('category') prodCategory: string,
        @Body('imageUrl') prodImageUrl: string,
    ) {
        await this.productServicer.updateProduct(prodId, prodTitle, prodPrice, prodCategory, prodImageUrl);
        return null;
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    async removeProduct(@Param('id') prodId: string) {
        await this.productServicer.deleteProduct(prodId);
        return null;
    }

}