import { NestMiddleware, UnauthorizedException, Header, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { Request } from "express-serve-static-core";
import { Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: () => void) {
        const header = req.headers;
        const token = header['auth-token'];

        if (!token){
            throw new UnauthorizedException('You dont have access!!!');
        }

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.body.user = verified;  // Save user in the req body
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid Token!!!');            
        }
    }
    
}