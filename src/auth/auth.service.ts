import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RxUser } from 'src/entity/RxUser';
import { getRepository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.debug('AuthService*****');
    const user = await getRepository(RxUser)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where({ loginName: username })
      .getOne();
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      console.debug('AuthService', user);
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
