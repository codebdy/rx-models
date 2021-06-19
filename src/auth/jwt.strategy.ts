import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { RxUser } from 'src/entity/RxUser';
import { getRepository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.debug('JwtStrategy payload', payload);
    const userId = payload.sub;
    return await getRepository(RxUser)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where({ id: userId })
      .getOne();
  }
}
