import { Injectable, Logger } from '@nestjs/common';
import { PackageMeta } from 'src/meta/entity/package-meta';
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

  constructor(private readonly typeormSerivce: TypeOrmWithSchemaService) {}

  public async install(data: InstallData) {
    const dbConfigData = {
      type: data.type,
      host: data.host,
      port: data.port,
      database: data.database,
      username: data.username,
      password: data.password,
    };
    PlatformTools.writeFile(
      DB_CONFIG_FILE,
      JSON.stringify(dbConfigData, null, 2),
    );

    await this.typeormSerivce.restart();

    const packageRepository = this.typeormSerivce.connection.getRepository<PackageMeta>(
      'RxPackage',
    );
    let systemPackage = await packageRepository.findOne({
      where: { uuid: packageSeed.uuid },
    });

    if (!systemPackage) {
      systemPackage = packageRepository.create();
    }
    systemPackage.uuid = packageSeed.uuid;
    systemPackage.name = packageSeed.name;
    systemPackage.status = packageSeed.status;
    systemPackage.entities = packageSeed.entities;
    systemPackage.diagrams = packageSeed.diagrams;
    systemPackage.relations = packageSeed.relations;

    packageRepository.save(systemPackage);

    await this.typeormSerivce.restart();
    return {
      success: true,
    };
  }

  public async isInstalled() {
    return { installed: PlatformTools.fileExist(DB_CONFIG_FILE) };
  }
}
