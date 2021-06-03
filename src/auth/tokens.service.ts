import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { RefreshToken } from 'src/entity/RefreshToken';
import { RxUser } from 'src/entity/RxUser';
import { getManager } from 'typeorm';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience: 'https://my-app.com',
};

@Injectable()
export class TokensService {
  private readonly jwt: JwtService;

  public constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  public async generateAccessToken(user: RxUser): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
    };

    return this.jwt.signAsync({}, opts);
  }

  public async generateRefreshToken(
    user: RxUser,
    expiresIn: number,
  ): Promise<string> {
    const token = await this.createRefreshToken(user, expiresIn);

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
      jwtid: String(token.id),
    };

    return this.jwt.signAsync({}, opts);
  }

  private async createRefreshToken(
    user: RxUser,
    ttl: number,
  ): Promise<RefreshToken> {
    const token = new RefreshToken();

    token.userId = user.id;
    token.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    token.expires = expiration;
    const entityManager = getManager();

    return entityManager.save(token);
  }
}
