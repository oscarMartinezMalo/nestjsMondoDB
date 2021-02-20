import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as  jwt from 'jsonwebtoken';
import { Token } from "./token.model";
import { User } from "./user.model";
import { MailgunService } from "@nextnm/nestjs-mailgun";
import { EmailOptions } from "./email.model";


@Injectable()
export class AuthService {
    // resfreshTokens = [];

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Token') private readonly tokenModel: Model<Token>,
        private mailgunService: MailgunService
    ) { }

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
            password: hashedPassword,
            role: 'Subscriber'
        });

        // SAVE THE NEW USER
        const result = await newUser.save();
        return result.id as string;
    }

    async logIn(email: string, password: string) {
        // CHECK IF THE EMAIL EXIST IN THE DATABASE
        const userStored = await this.userModel.findOne({ email: email });
        if (!userStored) { throw new ForbiddenException('User not found'); };

        // CHECK IF PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(password, userStored.password);
        if (!validPass) { throw new ForbiddenException('Wrong Password try again!!!'); }

        const accessToken = this.generateAccessToken(userStored.id, userStored.email, userStored.role);
        const refreshToken = jwt.sign({ user: { id: userStored.id, email: userStored.email, role: userStored.role } }, process.env.REFRESH_TOKEN_SECRET);

        this.saveRefreshToken(refreshToken); // Store refresh token in the dataBase
        return { accessToken: accessToken, refreshToken: refreshToken, id: userStored.id, email: userStored.email, role: userStored.role };
    }

    async resetPassword(user: { id: string, email: string }, currentPassword: string, newPassword: string){
        // CHECK IF THE USER EXIST IN THE DATABASE
        const userStored = await this.userModel.findById(user.id);
        if (!userStored) { throw new ForbiddenException('User no exits'); }

        // CHECK IF CURRENT PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(currentPassword, userStored.password);
        if (!validPass) { throw new ForbiddenException('Wrong Password try again!!!'); }

        // UPDATE THE PASSWORD WITH NEW PASSWORD 
                //HASH THE PASSWORD
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

                // UPDATE USER PASSWORD
                const result = await userStored.updateOne({password: hashedPassword});
                if (!result) { throw new ForbiddenException('Wrong Password try again!!!'); }

                // GENERATE NEW TOKEN AND REFRESH TOKEN
                const accessToken = this.generateAccessToken(userStored.id, userStored.email, userStored.role);
                const refreshToken = jwt.sign({ user: { id: userStored.id, email: userStored.email, role: userStored.role } }, process.env.REFRESH_TOKEN_SECRET);
        
                this.saveRefreshToken(refreshToken); // Store refresh token in the dataBase
                return { accessToken: accessToken, refreshToken: refreshToken, id: userStored.id, email: userStored.email, role: userStored.role };
    }

    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email: email });
        if (!user) { throw new ForbiddenException('User not found'); };

        const token = jwt.sign({ user: { id: user.id } }, process.env.RESET_PASSWORD_TOKEN_SECRET, {expiresIn:'10m'});

        const emailBody: EmailOptions = {
            from: 'noreply@gmail.com',
            to: 'ommalor@gmail.com',
            subject: 'Account Activation Link',
            html: `
                <h2>Please click on given link to activate your account</h2>
                <p>${process.env.CLIENT_URL}/forgot-password-token/${token} </p>
            `
        }

        await this.mailgunService.sendEmail(emailBody);
    }

    async saveRefreshToken(token: string) {
        const newRefreshToken = new this.tokenModel({ token: token });
        await newRefreshToken.save();
    }

    async getNewAccessToken(refreshToken: string) {
        if (!refreshToken) throw new ForbiddenException('Access denied');
        
        const refTok = await this.tokenModel.findOne({ token: refreshToken });
        if (!refTok) {
            throw new ForbiddenException('Access denied');
        }

        try {
            const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = this.generateAccessToken(verified.user.id, verified.user.email, verified.user.role);
            return { accessToken: newAccessToken };
        } catch (error) {
            throw new ForbiddenException('Access denied');
        }
    }

    private generateAccessToken(userId: string, userEmail: string, userRole: string) {
        return jwt.sign({ id: userId, email: userEmail, role: userRole }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6000s' });
    }

    async logOut(refreshToken: string) {
        const result = await this.tokenModel.deleteOne({ token: refreshToken }).exec();
        if (result.n === 0) {
            throw new NotFoundException('Could not find token');
        }
    }

}