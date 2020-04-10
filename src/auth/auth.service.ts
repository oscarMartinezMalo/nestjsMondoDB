import { Injectable, ForbiddenException } from "@nestjs/common";
import { User } from "./user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as  jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    // resfreshTokens = [];

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

        const accessToken = this.generateAccessToken(userStored.id, userStored.email);
        const refreshToken = jwt.sign({
            user: {
                id: userStored.id,
                email: userStored.email
            }
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30s' });
        // this.resfreshTokens.push( refreshToken); // Store refresh token in the dataBase
        return { accessToken: accessToken, refreshToken: refreshToken, id: userStored.id, email: userStored.email };
    }

    generateAccessToken(userId: string, userEmail: string) {
        return jwt.sign({ id: userId, email: userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
    }

    refreshTokenExits(token: string) {
        if (!token) throw new ForbiddenException('Access denied');
        // if (!this.resfreshTokens.includes(token)) throw new ForbiddenException('Access denied');

        try {
            const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = this.generateAccessToken(verified.id, verified.email);
            return { accessToken: newAccessToken };
        } catch (error) {
            throw new ForbiddenException('Access denied');
        }
    }

    logOut() {
        // delete refreshToken from the dataBase
        // If you dont set an expire in the refresh token you have to delete the token
    }

}