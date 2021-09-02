import {
  Controller,
  Get,
  HttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private service: StorageService) {}

  @UseGuards(AuthGuard())
  @Get('image/:path/:size?')
  async getImage(@Param('path') path: string, @Param('size') size: string) {
    try {
      return await this.service.getImage(path, size);
    } catch (error: any) {
      console.error('get-token-object error:', error);
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }

  //客户端上传OSS用的TOKEN，本方法暂时没用
  @UseGuards(AuthGuard())
  @Get('get-token-object')
  async getTokenObject() {
    try {
      return await this.service.getTokenObject();
    } catch (error: any) {
      console.error('get-token-object error:', error);
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
