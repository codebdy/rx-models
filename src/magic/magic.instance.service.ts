import { AbilityService } from 'src/ability/ability.service';
import { PostCommandService } from 'src/command/post-command.service';
import { QueryCommandService } from 'src/command/query-command.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { MagicPost } from './post/magic.post';
import { MagicQuery } from './query/magic.query';

/**
 * 操作数据库通用类，所有数据库操作都应该通过该类进行，因为该类负责权限控制
 * 该类不需要注入，自己管理创建。
 * 该类的所有操作都在一个事务创建的EntityManager里
 */
export class MagicInstanceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly queryCommandService: QueryCommandService,
    private readonly postCommandService: PostCommandService,
    private readonly schemaService: SchemaService,
  ) {}
  async query(json: any) {
    return await new MagicQuery(
      this.entityManager,
      this.abilityService,
      this.queryCommandService,
      this.schemaService,
    ).query(json);
  }

  async post(json: any) {
    return await new MagicPost(
      this.entityManager,
      this.abilityService,
      this.postCommandService,
      this.schemaService,
    ).post(json);
  }

  async update(json: any) {}

  async delete(json: any) {}
}
