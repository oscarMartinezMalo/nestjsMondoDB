import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getCredentials(user: {
        id: string;
        email: string;
        role: string;
    }): {
        id: string;
        email: string;
        role: string;
    };
    signUp(completeBody: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    logIn(completeBody: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: any;
        refreshToken: any;
        id: string;
        email: string;
        role: string;
    }>;
    resfreshToken(refreshToken: any): Promise<{
        accessToken: any;
    }>;
    deleteRefreshToken(token: string): Promise<any>;
}