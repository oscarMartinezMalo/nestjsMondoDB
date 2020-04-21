import { Model } from "mongoose";
import { Token } from "./token.model";
import { User } from "./user.model";
export declare class AuthService {
    private readonly userModel;
    private readonly tokenModel;
    constructor(userModel: Model<User>, tokenModel: Model<Token>);
    createAccount(email: string, password: string): Promise<string>;
    logIn(email: string, password: string): Promise<{
        accessToken: any;
        refreshToken: any;
        id: string;
        email: string;
        role: string;
    }>;
    saveRefreshToken(token: string): Promise<void>;
    getNewAccessToken(refreshToken: string): Promise<{
        accessToken: any;
    }>;
    private generateAccessToken;
    logOut(refreshToken: string): Promise<void>;
}
