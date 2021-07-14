import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
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
    try {
      console.debug('JwtStrategy payload', payload);
      const userId = payload.sub;
      return await getRepository('RxUser')
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.avatar', 'avatar')
        .where({ id: userId })
        .getOne();
    } catch (error: any) {
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }
}
