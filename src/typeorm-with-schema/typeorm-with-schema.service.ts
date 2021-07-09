import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  Connection,
  createConnection,
  EntitySchema,
  getConnectionOptions,
  Repository,
} from 'typeorm';
import { predefinedEntities } from './entity';

export const CONNECTION_WITH_SCHEMA_NAME = 'withSchema';

@Injectable()
export class TypeOrmWithSchemaService
  implements OnModuleInit, OnApplicationShutdown {
  private readonly _logger = new Logger('TypeOrmWithSchemaService');
  private _connection?: Connection;
  private _entitySchemas = new Map<string, EntitySchema>();

  async createConnection() {
   /* const connectionOptions = await getConnectionOptions();
    this.cachePredefinedEntities();
    const entitiesInDatabase = this.loadEntityEntities();
    this._connection = await createConnection({
      ...connectionOptions,
      entities: [...predefinedEntities, ...entitiesInDatabase],
      name: CONNECTION_WITH_SCHEMA_NAME,
      synchronize: true,
    });*/
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

  async restart() {
    this.closeConection();
    await this.createConnection();
  }

  async onModuleInit() {
    //await this.createConnection();
    console.debug('TypeOrmWithSchemaService initializated');
  }

  async onApplicationShutdown() {
    this.closeConection();
  }

  private async closeConection() {
    try {
      this.connection?.isConnected && (await this.connection.close());
    } catch (e) {
      this._logger.error(e?.message);
    }
  }

  private cachePredefinedEntities() {
    predefinedEntities.forEach((entity: EntitySchema) => {
      this._entitySchemas.set(entity.options.name, entity)
    });
  }

  private /*async*/ loadEntityEntities(): EntitySchema<any>[] {
    //return schemas.map((schemaMeta: any) => {
    //  const entitySchema = new EntitySchema(schemaMeta);
    //  this._entitySchemas.set(schemaMeta.name, entitySchema);
    //  return entitySchema;
    //});
    return [];
  }
}
