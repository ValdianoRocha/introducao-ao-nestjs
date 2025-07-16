import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        const meusegredo = process.env.JWT_SECRET
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'uma_chave_secreta_forte' 
        })
    }

    async validate(payload: any) {
        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        }

    }
}