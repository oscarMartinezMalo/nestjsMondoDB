import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, Header, UseGuards } from "@nestjs/common";
import { ProductService } from "./products.service";
import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
import { ProductValidationSchema } from "./product-joi.validation";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";

@Controller('products')
export class ProductsController {
    constructor(private readonly productServicer: ProductService) { }

    //Ex. Poduct Format { "title": "oscar", "description": "Martinez", "price": 5 }
    @Post()
    @UsePipes(new JoiValidationPipe(ProductValidationSchema))
    @UseGuards(new AuthGuard())
    async addProduct(
        @Body() completeBody: { title: string, description: string, price: number},
        @User() user: {id: string, email: string}
    ) {
        // console.log(user);
        const generatedId = await this.productServicer.insertProduct(completeBody.title, completeBody.description, completeBody.price);
        return { id: generatedId };
    }


    @Get()
    @UseGuards(new AuthGuard())
    async getAllProducts(@User() user: { id: string, email: string }) {
        // console.log(user);
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