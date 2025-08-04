import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from './auth.service';


@Injectable()
export class GoogleService {
    private client: OAuth2Client

    constructor(private authService: AuthService) {
        this.client = new OAuth2Client(process.env.GOOLE_CLIENT_ID)
    }

    async veryfy(idToken: string) {

        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: process.env.GOOLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        if (!payload) throw new UnauthorizedException('Token unválido!')

        const {sub, email, name} = payload

        //criar o usuario se ele não tiver conta na API
        //ou logar o usuario se já tiver conta

        const user = await this.authService.findOrCreateGoogleUser({
            googleID: sub,
            email,
            name,
        })

        return this.authService.signJwtForUser(user)
    }


}
