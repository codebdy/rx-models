import { Injectable } from '@nestjs/common';
import { MagicPostParamsParser } from './param/post.param.parser';

@Injectable()
export class MagicPostService {
  async post(json: any) {
    const entities = new MagicPostParamsParser(json).entityMetas;
    return {};
  }
}
