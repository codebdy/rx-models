import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { EntityMeta } from 'src/meta/entity/entity-meta';
import { PackageMeta } from 'src/meta/entity/package-meta';
import { RelationMeta, RelationType } from 'src/meta/entity/relation-meta';
import { DB_CONFIG_FILE, SCHEMAS_DIR } from 'src/util/consts';
import { importJsonsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import {
  Connection,
  createConnection,
  EntitySchema,
  EntitySchemaColumnOptions,
  EntitySchemaRelationOptions,
  Repository,
} from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { convertType } from './convert-type';
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
    const entitySchemaOptions: EntitySchemaOptions<any>[] = [];
    const packages: PackageMeta[] = importJsonsFromDirectories([
      SCHEMAS_DIR + '*.json',
    ]);

    packages.forEach((aPackage) => {
      entityMetas.push(...(aPackage.entities || []));
      relationMetas.push(...(aPackage.relations || []));
    });

    entityMetas.forEach((entityMeta) => {
      const columns: { [key: string]: EntitySchemaColumnOptions } = {};
      const relations: { [key: string]: EntitySchemaRelationOptions } = {};
      for (const column of entityMeta.columns) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, type, uuid, ...rest } = column;
        columns[column.name] = {
          ...rest,
          type: convertType(column.type),
        };
      }

      for (const relation of relationMetas) {
        if (relation.sourceId === entityMeta.uuid) {
          relations[relation.roleOnSource] = {
            target: entityMeta.name,
            type: relation.relationType,
            joinTable:
              relation.relationType === RelationType.MANY_TO_MANY &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
            joinColumn:
              relation.relationType === RelationType.ONE_TO_ONE &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
          };
        }
        if (relation.targetId === entityMeta.uuid) {
          let relationType = relation.relationType;
          if (relation.relationType === RelationType.ONE_TO_MANY) {
            relationType = RelationType.MANY_TO_ONE;
          }
          if (relation.relationType === RelationType.MANY_TO_ONE) {
            relationType = RelationType.ONE_TO_MANY;
          }
          relations[relation.roleOnSource] = {
            target: entityMeta.name,
            type: relationType,
            joinTable:
              relationType === RelationType.MANY_TO_MANY &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
            joinColumn:
              relationType === RelationType.ONE_TO_ONE &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
          };
        }
      }

      const entitySchemaOption: EntitySchemaOptions<any> = {
        name: entityMeta.name,
        columns: columns,
        relations: relations,
      };

      entitySchemaOptions.push(entitySchemaOption);
    });

    return entitySchemaOptions.map(
      (entityMeta) => new EntitySchema<any>(entityMeta),
    );
  }
}
