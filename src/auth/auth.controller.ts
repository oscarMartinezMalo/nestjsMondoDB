import { Controller, Post, Body, UsePipes, Headers, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { registerValidationSchema, loginValidationSchema } from "./auth-joi.validation";
import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
import { User } from "src/decorators/user.decorator";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @Get() 
    @UseGuards(new AuthGuard())
    getCredentials(@User() user: { id: string, email: string }) {
        return {id: user.id, email: user.email};
    }

    // Ex. { "email": "ommalor@gmail.com", "password": "asdasd" }
    @Post('signup')
    @UsePipes(new JoiValidationPipe(registerValidationSchema))
    async signUp(
        @Body() completeBody: { email: string, password: string }  // If you want to get whole the body
        // @Body('email') authEmail: string,                       // If Get Element from body one by onte
        // @Body('password') authPassword: string                  // the pipe auth is called two times
    ) {
        await this.authService.createAccount(completeBody.email, completeBody.password);
        return { message: 'User created' };
    }

    // @Header()
    @Post('login')
    @UsePipes(new JoiValidationPipe(loginValidationSchema))
    async logIn(@Body() completeBody: { email: string, password: string }) {
        const token = await this.authService.logIn(completeBody.email, completeBody.password);
        return token;
    }

    @Post('refresh-token')
    @UsePipes()
    async resfreshToken(@Headers('JWT_TOKEN') refreshToken: any) {
        return this.authService.getNewAccessToken(refreshToken);
    }
}