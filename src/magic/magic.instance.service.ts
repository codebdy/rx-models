import { AbilityService } from 'src/magic/ability.service';
import { DeleteDirectiveService } from 'src/directive/delete-directive.service';
import { PostDirectiveService } from 'src/directive/post-directive.service';
import { QueryDirectiveService } from 'src/directive/query-directive.service';
import { QueryResult } from 'src/magic-meta/query/query-result';
import { MagicService } from 'src/magic-meta/magic.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { MagicDelete } from './delete/magic.delete';
import { MagicPost } from './post/magic.post';
import { MagicQuery } from './query/magic.query';
import { MagicUpdate } from './update/magic.update';
import { StorageService } from 'src/storage/storage.service';

/**
 * 操作数据库通用类，所有数据库操作都应该通过该类进行，因为该类负责权限控制
 * 该类不需要注入，自己管理创建。
 * 该类的所有操作都在一个事务创建的EntityManager里
 */
export class MagicInstanceService implements MagicService {
  constructor(
    private readonly entityManager: EntityManager,
    public readonly abilityService: AbilityService,
    public readonly queryDirectiveService: QueryDirectiveService,
    public readonly postDirectiveService: PostDirectiveService,
    public readonly deleteDirectiveService: DeleteDirectiveService,
    public readonly schemaService: SchemaService,
    public readonly storageService: StorageService,
  ) {}

  get me() {
    return this.abilityService.me;
  }

  async query(json: any): Promise<QueryResult> {
    return await new MagicQuery(
      this.entityManager,
      this.abilityService,
      this.queryDirectiveService,
      this.schemaService,
      this.storageService,
      this,
    ).query(json);
  }

  async post(json: any) {
    return await new MagicPost(
      this.entityManager,
      this.abilityService,
      this.postDirectiveService,
      this.schemaService,
      this,
    ).post(json);
  }

  async delete(json: any) {
    return await new MagicDelete(
      this.entityManager,
      this.abilityService,
      this.deleteDirectiveService,
      this.schemaService,
      this,
    ).delete(json);
  }

  async update(json: any) {
    return await new MagicUpdate(
      this.entityManager,
      this.schemaService,
      this.abilityService,
      this,
    ).update(json);
  }

  /**
   * 拿到该变量，意味着已经脱离了权限控制，请一定不要进行数据库修改操作
   */
  getEntityManager() {
    return this.entityManager;
  }
}
