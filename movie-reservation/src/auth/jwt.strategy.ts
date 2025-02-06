import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY', 
    });
  }

  async validate(payload: any) {
    console.log(' JWT Payload reçu:', payload); 

    if (!payload.id) {
      throw new UnauthorizedException('Le token est invalide.');
    }

    return { id: payload.id, email: payload.email };
  }
}




