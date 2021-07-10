import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RxUser } from 'src/meta/entity/rx-user';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';
import { NOT_INSTALL_ERROR } from 'src/util/consts';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly typeormSerivce: TypeOrmWithSchemaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    if (!this.typeormSerivce.connection) {
      throw new Error(NOT_INSTALL_ERROR);
    }
    console.debug('AuthService*****');
    const user = (await this.typeormSerivce.connection
      .getRepository('RxUser')
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where({ loginName: username })
      .getOne()) as RxUser;
    if (user && (await bcrypt.compare(pass, user.password))) {
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
