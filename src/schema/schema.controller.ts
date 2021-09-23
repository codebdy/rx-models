import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RxUser } from 'src/entity-interface/RxUser';
import { SchemaService } from './schema.service';

@Controller()
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @UseGuards(AuthGuard())
  @Get('published-schema')
  getSchemas(@Request() req) {
    const user = req.user as RxUser;
    if (!user.isSupper && !user.isDemo) {
      return [];
    }
    return this.schemaService.getPackageSchemas();
  }
}
