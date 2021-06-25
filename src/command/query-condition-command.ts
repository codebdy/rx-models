export interface QueryConditionCommand {
  getWhereStatement(): { whereSql: string; params: any };
}
