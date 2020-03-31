import { NestMiddleware, UnauthorizedException, Header } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export class AuthMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: () => void) {
        const header = req.headers;
        const token = header['auth-token'];
        if (!token){
            throw new UnauthorizedException('You dont have access!!!');
        }

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req['user'] = verified;
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid Token!!!');
            
        }
    }
    
}