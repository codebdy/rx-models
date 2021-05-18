import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 通用查询接口，语法示例：
   * {
   *   "":{
   *   }
   * }
   * @param json JSON格式的查询条件
   * @returns 查询结果
   */
  @Get('get/:json?')
  getModels(@Param('json') json): string {
    return json;
  }
}
