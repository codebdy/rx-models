import { Injectable, Logger } from '@nestjs/common';
import { PackageManageService } from 'src/package-manage/package-manage.service';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';
import { DB_CONFIG_FILE } from 'src/util/consts';
import { EntitySchema } from 'typeorm';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { InstallData } from './install.data';
import { packageSeed } from './install.seed';

export const CONNECTION_WITH_SCHEMA_NAME = 'withSchema';

@Injectable()
export class InstallService {
  private readonly _logger = new Logger('TypeOrmWithSchemaService');
  private _entitySchemas = new Map<string, EntitySchema>();

  constructor(
    private readonly typeormSerivce: TypeOrmWithSchemaService,
    private readonly packageManage: PackageManageService,
  ) {}

  public async install(data: InstallData) {
    const dbConfigData = {
      type: data.type,
      host: data.host,
      port: data.port,
      database: data.database,
      username: data.username,
      password: data.password,
    };
    await PlatformTools.writeFile(
      DB_CONFIG_FILE,
      JSON.stringify(dbConfigData, null, 2),
    );

    await this.packageManage.publishPackage(packageSeed);
    await this.typeormSerivce.restart();
    await this.packageManage.savePackage(packageSeed);

    return {
      success: true,
    };
  }

  public async isInstalled() {
    return { installed: PlatformTools.fileExist(DB_CONFIG_FILE) };
  }
}
