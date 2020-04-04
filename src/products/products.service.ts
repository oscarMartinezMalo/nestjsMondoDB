import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./product.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ProductService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

    async insertProduct(title: string, price: number, category: string, imageUrl: string) {
        const newProduct = new this.productModel({ title, price, category, imageUrl });
        const result = await newProduct.save();
        return result.id as string;
    }

    async getProducts() {
        // Map the array since the object inside the array are reference Obj
        const products = await this.productModel.find().exec();
        return products.map((prod) => ({
            id: prod.id,
            title: prod.title,
            price: prod.price,
            category: prod.category,
            imageUrl: prod.imageUrl
        }));
    }

    async getSingleProduct(id: string) {
        const product = await this.findProduct(id);
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl
        };
    }

    async updateProduct(id: string, title: string, price: number, category: string, imageUrl: string) {
        const updateProduct = await this.findProduct(id);

        if (title) { updateProduct.title = title; }
        if (price) { updateProduct.price = price; }
        if (category) { updateProduct.category = category; }
        if (imageUrl) { updateProduct.imageUrl = imageUrl; }

        updateProduct.save();
    }

    async deleteProduct(id: string) {
        const result = await this.productModel.deleteOne({ _id: id }).exec();
        if (result.n === 0) {
            throw new NotFoundException('Could not find product');
        }
    }

    async findProduct(id: string): Promise<Product> {
        let product;
        try {
            product = await this.productModel.findById(id);
        } catch (error) {
            throw new NotFoundException('Could not find product');
        }
        if (!product) {
            throw new NotFoundException('Could not find product');
        }
        return product;
    }
}