import { QueryCommand } from 'src/command/query/query.command';
import { createId } from 'src/util/create-id';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { AbilityValidateResult } from '../ability-validate-restult';
import { QueryAddonRelationMeta } from './query.addon-relation-meta';
import { QueryRelationMeta } from './query.relation-meta';

export abstract class QueryMeta {
  id: number;
  entitySchema: EntitySchemaOptions<any>;
  private _entity: string;
  relationMetas: QueryRelationMeta[] = [];
  conditionCommands: QueryCommand[] = [];
  //条件或者where指令中附加的关联
  conditionAddonRelationMetas: QueryAddonRelationMeta[] = [];
  //权限判断附加的关联
  abilityAddonRelationMetas: QueryAddonRelationMeta[] = [];

  //权限检查结果:ture - 可以读，false - 不可以读，数组 - 通过表达式判定是否可读
  abilityValidateResult: AbilityValidateResult = false;

  constructor() {
    this.id = createId();
  }

  public get entity(): string {
    return this._entity;
  }
  public set entity(value: string) {
    this._entity = value;
  }

  get alias() {
    return this.entity?.toLowerCase() + this.id;
  }

  abstract pushCommand(command: QueryCommand): void;

  pushConditionCommand(command: QueryCommand) {
    this.conditionCommands.push(command);
  }

  findRelatiOrFailed(relationName: string): QueryRelationMeta {
    for (const relationMeta of [
      ...this.relationMetas,
      ...this.conditionAddonRelationMetas,
      ...this.abilityAddonRelationMetas,
    ]) {
      if (relationMeta.name === relationName) {
        return relationMeta;
      }
    }
    throw new Error(
      `Please add relation ${relationName} of ${this.entity} to query meta`,
    );
  }

  getCommandsWhereStatement(commands: QueryCommand[]): [string, any] {
    const whereStringArray: string[] = [];
    let whereParams: any = {};
    commands.forEach((command) => {
      const [whereStr, param] = command.getWhereStatement() || [];
      if (whereStr) {
        whereStringArray.push(whereStr);
        whereParams = { ...whereParams, ...param };
      }
    });
    if (whereStringArray.length > 0) {
      return [whereStringArray.join(' AND '), whereParams];
    }
    return [undefined, undefined];
  }
}
