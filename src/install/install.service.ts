/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger } from '@nestjs/common';
import { DB_CONFIG_FILE } from 'src/util/consts';
import { Connection, EntitySchema } from 'typeorm';
import { InstallData } from './install.data';

export const CONNECTION_WITH_SCHEMA_NAME = 'withSchema';

@Injectable()
export class InstallService {
  private readonly _logger = new Logger('TypeOrmWithSchemaService');
  private _connection: Connection;
  private _entitySchemas = new Map<string, EntitySchema>();

  constructor(private readonly originalConnection: Connection) {}

  public async install(data: InstallData) {

  }

  public async isInstalled() {
    const fs = require('fs');
    return { installed: fs.existsSync(DB_CONFIG_FILE) };
  }
}
