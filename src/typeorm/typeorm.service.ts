import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { SchemaService } from 'src/schema/schema.service';
import { DB_CONFIG_FILE } from 'src/util/consts';
import {
  Connection,
  createConnection,
  EntitySchema,
  Repository,
} from 'typeorm';
import { PlatformTools } from 'typeorm/platform/PlatformTools';

const CONNECTION_WITH_SCHEMA_NAME = 'WithSchema';

@Injectable()
export class TypeOrmService implements OnModuleInit, OnApplicationShutdown {
  private readonly _logger = new Logger('TypeOrmWithSchemaService');
  private _connection?: Connection;
  private _connectionNumber = 1;
  private host: string;

  constructor(private readonly schemaService: SchemaService) {}
  setHost(host: string) {
    this.host = host;
  }

  getHost() {
    return this.host;
  }
  async createConnection() {
    if (!PlatformTools.fileExist(DB_CONFIG_FILE)) {
      return;
      //throw new Error(NOT_INSTALL_ERROR);
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dbConfig = require(PlatformTools.pathResolve(DB_CONFIG_FILE));

    this._connection = await createConnection({
      ...dbConfig,
      entities: this.schemaService.entitySchemas.map(
        (schema) => new EntitySchema<any>(schema),
      ),
      name: CONNECTION_WITH_SCHEMA_NAME + this._connectionNumber,
      synchronize: true,
    });
  }

  public get connection() {
    return this._connection;
  }

  public getRepository<Entity>(name: string): Repository<Entity> {
    return this.connection.getRepository(name);
  }

  //会关闭旧连接，并且以新名字创建一个新连接
  async restart() {
    this.closeConection();
    this._connectionNumber++;
    //重新加载模式
    this.schemaService.reload();
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
}
