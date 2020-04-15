import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from "./user.model";
import { TokenSchema } from "./token.model";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Token', schema: TokenSchema }])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule{

}