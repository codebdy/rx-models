import { QueryCommand } from 'src/command/query-command';

export class RelationMeta {
  alias: string;
  relationMetas: RelationMeta[] = [];
  relationCommands: QueryCommand[] = [];
  //conditonCommands主要用于ON条件
  conditionCommands: QueryCommand[] = [];

  findOrRepairRelation(relationName: string): RelationMeta {
    return;
  }
}
