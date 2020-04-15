import { Controller, Post, Body, UsePipes, Headers, Get, UseGuards, Delete, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { registerValidationSchema, loginValidationSchema } from "./auth-joi.validation";
import { JoiValidationPipe } from "src/pipes/joi-validation.pipe";
import { User } from "src/decorators/user.decorator";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    // Return the User After passes the Guard 
    @Get()
    @UseGuards(new AuthGuard())
    getCredentials(@User() user: { id: string, email: string, role: string }) {
        // Instance of this you should get the current User from the dataBase
        return { id: user.id, email: user.email, role: user.role };
    }

    @Post('signup')
    @UsePipes(new JoiValidationPipe(registerValidationSchema))
    async signUp(@Body() completeBody: { email: string, password: string }) {
        await this.authService.createAccount(completeBody.email, completeBody.password);
        return { message: 'User created' };
    }

    @Post('login')
    @UsePipes(new JoiValidationPipe(loginValidationSchema))
    async logIn(@Body() completeBody: { email: string, password: string }) {
        const token = await this.authService.logIn(completeBody.email, completeBody.password);
        return token;
    }

    @Post('refresh-token')
    async resfreshToken(@Body() refreshToken) {
        // async resfreshToken(@Headers('JWT_TOKEN') refreshToken: any) {
        const refToken = Object.values(refreshToken)[0] as string;
        const token = this.authService.getNewAccessToken(refToken);
        return token;
    }

    @Delete(':token')
    async deleteRefreshToken(@Param('token') token: string){
        await this.authService.logOut(token);
        return null;        
    }
}