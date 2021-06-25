import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export const CONNECTION_WITH_SCHEMA_NAME = 'withSchema';

@Injectable()
export class TypeOrmWithSchemaService
  implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger('TypeOrmWithSchemaService');
  private _connection: Connection;
  constructor(private readonly originalConnection: Connection) {}

  async createConnection() {
    const connectionOptions = await getConnectionOptions();

    this._connection = await createConnection({
      ...connectionOptions,
      name: CONNECTION_WITH_SCHEMA_NAME,
    });
  }

  public get connection() {
    return this._connection;
  }

  async restart() {
    this.closeConection();
    await this.createConnection();
    await this.loadEntitySchemas();
  }

  async onModuleInit() {
    await this.createConnection();
    await this.loadEntitySchemas();
    console.debug('TypeOrmWithSchemaService initializated');
  }

  async onApplicationShutdown() {
    this.closeConection();
  }

  private async closeConection() {
    try {
      this.connection?.isConnected && (await this.connection.close());
    } catch (e) {
      this.logger.error(e?.message);
    }
  }

  private async loadEntitySchemas() {}
}
