import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
