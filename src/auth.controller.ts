import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) {}

  //@UseGuards(AuthGuard('local'))
  //@Post('login')
  //async login(@Request() req) {
  //  return req.user;
  //}

  //@UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(): string {
    return 'me';
  }
}
