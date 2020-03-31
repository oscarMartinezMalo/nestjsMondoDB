import { Controller, Post, Body, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { registerValidationSchema, loginValidationSchema } from "./auth-joi.validation";
import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    // Ex. { "email": "ommalor@gmail.com", "password": "asdasd" }
    @Post('signup')
    @UsePipes(new JoiValidationPipe(registerValidationSchema))
    async signUp(
        @Body() completeBody: { email: string, password: string }  // If you want to get whole the body
        // @Body('email') authEmail: string,                       // If Get Element from body one by onte
        // @Body('password') authPassword: string                  // the pipe auth is called two times
    ) {
        const generatedId = await this.authService.createAccount(completeBody.email, completeBody.password);
        return { id: generatedId };
    }

    // @Header()
    @Post('login')
    @UsePipes(new JoiValidationPipe(loginValidationSchema))
    async logIn( @Body() completeBody: { email: string, password: string } ) {
        const token = await this.authService.logIn(completeBody.email, completeBody.password);
        return token;
    }
}