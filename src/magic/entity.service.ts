import { AbilityService } from 'src/ability/ability.service';
import { QueryCommandService } from 'src/command/query-command.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { MagicQuery } from './query/magic.query';

/**
 * 操作数据库通用类，所有数据库操作都应该通过该类进行，因为该类负责权限控制
 * 该类不需要注入，自己管理创建。
 * 该类的所有操作都在一个事务创建的EntityManager里
 */
export class EntityService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly commandService: QueryCommandService,
    private readonly schemaService: SchemaService,
  ) {}
  async query(json: any) {
    return await new MagicQuery(
      this.entityManager,
      this.abilityService,
      this.commandService,
      this.schemaService,
    ).query(json);
  }

  async post(json: any) {}

  async update(json: any) {}

  async delete(json: any) {}
}
