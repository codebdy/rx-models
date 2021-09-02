import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private service: StorageService) {}

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
