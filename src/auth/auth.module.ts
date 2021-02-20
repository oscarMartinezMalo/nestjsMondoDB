import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from "./user.model";
import { TokenSchema } from "./token.model";
import { MailgunModule } from "@nextnm/nestjs-mailgun";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Token', schema: TokenSchema }]),
        MailgunModule.forRoot({
        DOMAIN: 'sandbox4054593394dd4305a1cbad6439e3aff7.mailgun.org',
        API_KEY: '8efc2deca9ba683b377435a1fca62a50-d32d817f-2a534394',
        // HOST: 'api.eu.mailgun.net'
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule{

}