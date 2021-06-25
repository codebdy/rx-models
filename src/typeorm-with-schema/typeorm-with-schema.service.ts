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
import { schemas } from './schemas';

export const CONNECTION_WITH_SCHEMA_NAME = 'withSchema';

@Injectable()
export class TypeOrmWithSchemaService
  implements OnModuleInit, OnApplicationShutdown {
  private readonly _logger = new Logger('TypeOrmWithSchemaService');
  private _connection: Connection;
  private _entitySchemas = new Map<string, EntitySchema>();

  constructor(private readonly originalConnection: Connection) {}

  async createConnection() {
    const connectionOptions = await getConnectionOptions();

    const entitySchemas = this.loadEntitySchemas();
    this._connection = await createConnection({
      ...connectionOptions,
      entities: entitySchemas,
      name: CONNECTION_WITH_SCHEMA_NAME,
      synchronize: true,
    });
  }

  public get connection() {
    return this._connection;
  }

  public getEntitySchema(name: string) {
    return this._entitySchemas.get(name);
  }

  public getRepository<Entity>(name: string): Repository<Entity> {
    return this.connection.getRepository(this.getEntitySchema(name) || name);
  }

  async restart() {
    this.closeConection();
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
      this.connection?.isConnected && (await this.connection.close());
    } catch (e) {
      this._logger.error(e?.message);
    }
  }

  private /*async*/ loadEntitySchemas(): EntitySchema<any>[] {
    return schemas.map((schemaMeta: any) => {
      const entitySchema = new EntitySchema(schemaMeta);
      this._entitySchemas.set(schemaMeta.name, entitySchema);
      return entitySchema;
    });
  }
}
