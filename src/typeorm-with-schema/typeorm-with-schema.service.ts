import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class TypeOrmWithSchemaService
  implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger('TypeOrmService');

  public readonly connection: Connection;
  constructor(private readonly originalConnection: Connection) {
    this.connection = originalConnection;
  }

  async onModuleInit() {
    console.debug('TypeOrmWithSchemaService Init');
    await this.loadEntitySchemas();
  }

  public restart() {
    this.closeConection();
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
