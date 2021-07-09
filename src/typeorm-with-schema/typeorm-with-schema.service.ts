import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { EntityMeta } from 'src/meta/entity/entity-meta';
import { PackageMeta } from 'src/meta/entity/package-meta';
import { RelationMeta } from 'src/meta/entity/relation-meta';
import { DB_CONFIG_FILE, SCHEMAS_DIR } from 'src/util/consts';
import { importJsonsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import {
  Connection,
  createConnection,
  EntitySchema,
  Repository,
} from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { predefinedEntities } from './entity';

const CONNECTION_WITH_SCHEMA_NAME = 'WithSchema';

@Injectable()
export class TypeOrmWithSchemaService
  implements OnModuleInit, OnApplicationShutdown {
  private readonly _logger = new Logger('TypeOrmWithSchemaService');
  private _connection?: Connection;
  private _entitySchemas = new Map<string, EntitySchema>();
  private _connectionNumber = 1;

  async createConnection() {
    if (!PlatformTools.fileExist(DB_CONFIG_FILE)) {
      return;
      //throw new Error(NOT_INSTALL_ERROR);
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dbConfig = require(PlatformTools.pathResolve(DB_CONFIG_FILE));
    this.cachePredefinedEntities();
    const publishedEntities = this.loadEntityEntities();
    this._connection = await createConnection({
      ...dbConfig,
      entities: [...predefinedEntities, ...publishedEntities],
      name: CONNECTION_WITH_SCHEMA_NAME + this._connectionNumber,
      synchronize: true,
    });
  }

  public get connection() {
    return this._connection;
  }

  public findEntitySchemaOrFailed(name: string) {
    const schema = this._entitySchemas.get(name);
    if (!schema) {
      throw new Error(`Can not find model "${name}"`);
    }
    return schema;
  }

  public findRelationEntitySchema(model: string, relationName: string) {
    const entitySchema = this._entitySchemas.get(model);
    if (entitySchema.options.relations) {
      return entitySchema.options.relations[relationName];
    }
    return;
  }

  public getRepository<Entity>(name: string): Repository<Entity> {
    return this.connection.getRepository(
      this.findEntitySchemaOrFailed(name) || name,
    );
  }

  //会关闭旧连接，并且以新名字创建一个新连接
  async restart() {
    this.closeConection();
    this._connectionNumber++;
    await this.createConnection();
  }

  async onModuleInit() {
    await this.createConnection();
    console.debug('TypeOrmWithSchemaService initializated');
  }

  async onApplicationShutdown() {
    this.closeConection();
  }

  private async closeConection() {
    try {
      await this.connection?.close();
    } catch (e) {
      this._logger.error(e?.message);
    }
  }

  private cachePredefinedEntities() {
    predefinedEntities.forEach((entity: EntitySchema) => {
      this._entitySchemas.set(entity.options.name, entity);
    });
  }

  private loadEntityEntities(): EntitySchema<any>[] {
    const entityMetas: EntityMeta[] = [];
    const relationMetas: RelationMeta[] = [];
    const entitySchemas: EntitySchemaOptions<any>[] = [];
    const packages: PackageMeta[] = importJsonsFromDirectories([
      SCHEMAS_DIR + '*.json',
    ]);

    packages.forEach((aPackage) => {
      entityMetas.push(...(aPackage.entities || []));
      relationMetas.push(...(aPackage.relations || []));
    });
    //return schemas.map((schemaMeta: any) => {
    //  const entitySchema = new EntitySchema(schemaMeta);
    //  this._entitySchemas.set(schemaMeta.name, entitySchema);
    //  return entitySchema;
    //});
    return entitySchemas.map((entityMeta) => new EntitySchema<any>(entityMeta));
  }
}
