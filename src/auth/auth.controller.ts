import { Controller, Post, Body, Get, Param, Patch, Delete, Header } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(
        // @Body() completeBody: {title: string, description: string, price: number},  // If you want to get whole the body
        @Body('email') authEmail: string,
        @Body('password') authPassword: string) {

        const generatedId = await this.authService.createAccount(authEmail, authPassword);
        return { id: generatedId };
    }

    @Post('login')
    // @Header()
    async logIn(
        // {"email":"ommalor@gmail.com", "password":"123123"} 
        @Body('email') authEmail: string,
        @Body('password') authPassword: string) {

        const token = await this.authService.logIn(authEmail, authPassword);

        return token;
    }
}