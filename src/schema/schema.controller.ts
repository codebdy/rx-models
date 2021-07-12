import { Controller, Get } from '@nestjs/common';
import { SchemaService } from './schema.service';

@Controller()
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get('published-schema')
  getSchemas() {
    return this.schemaService.getPackageSchemas();
  }
}
