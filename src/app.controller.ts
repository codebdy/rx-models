import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    console.log('login', req);
    return req.user;
  }

  /**
   * 通用查询接口，语法示例：
   *   "User":{
   *      "id":1,
   *      "age@between":[18, 40],
   *      "where":{
   *        "name@like":"%风%",
   *        "orWhere":{
   *            "phone.type":"HUAWEI",
   *            "orWhere":{
   *              "cc":"XX",
   *            }
   *         },
   *         "where":{
   *           "email@notNull":true,
   *         }
   *      },
   *      "orWhere":{
   *      },
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
