export interface RxPackage {
  id?: number;
  uuid: string;
  name: string;
  entities: any;
  diagrams?: any;
  relations?: any;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
