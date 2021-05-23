import { Controller, HttpException, Post } from '@nestjs/common';
import { MagicPostService } from './magic.post.service';

@Controller()
export class MagicPostController {
  constructor(private readonly postService: MagicPostService) {}

  @Post('post')
  async postModels() {
    try {
      return await this.postService.post([{}]);
    } catch (error: any) {
      console.error('getModels error:', error);
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
