export type QueryResult = {
  data: any | any[];
  pagination?: {
    pageSize: number;
    pageIndex: number;
    totalCount: number;
  };
  //没有分页，没有skip，没有take等影响记录数量指令时，总数量。
  totalCount?: number;
};
