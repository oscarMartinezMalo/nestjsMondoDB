import { Injectable, ForbiddenException } from "@nestjs/common";
import { User } from "./user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as  jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async createAccount(email: string, password: string) {
        // CHECK IF THE USER EXIST IN THE DATABASE
        const userExits = await this.userModel.findOne({ email: email });
        if (userExits) {
            throw new ForbiddenException('User already exits');
        }

        //HASH THE PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // CREATE A NEW USER WITH THE  HASHEDPASSWORD
        const newUser = new this.userModel({
            email: email,
            password: hashedPassword
        });

        // SAVE THE NEW USER
        const result = await newUser.save();
        return result.id as string;
    }

    async logIn(email: string, password: string) {
        // CHECK IF THE EMAIL EXIST IN THE DATABASE
        const userStored = await this.userModel.findOne({ email: email });
        if (!userStored) {
            throw new ForbiddenException('User not found');
        };

        // CHECK IF PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(password, userStored.password);
        if (!validPass) {
             throw new ForbiddenException('Wrong Password try again!!!');            
        }

        const token = jwt.sign({ id: userStored.id, email: userStored.email }, process.env.TOKEN_SECRET);
        return {accessToken: token};
    }
    // updateUser(){}

}