import { ColumnType } from 'src/meta/entity/column-type';
import { PackageMeta } from 'src/meta/entity/package-meta';
import { PackageStatus } from 'src/meta/entity/package-status';
import { RelationType } from 'src/meta/entity/relation-type';

export const packageSeed: PackageMeta = {
  uuid: 'system-package-1',
  name: 'System',
  status: PackageStatus.SYNCED,
  entities: [
    {
      uuid: 'system-entity-1',
      name: 'RxUser',
      columns: [
        {
          uuid: 'system-column-1-3',
          name: 'id',
          type: ColumnType.Number,
          primary: true,
          generated: true,
        },
        {
          uuid: 'system-column-1-4',
          name: 'name',
          type: ColumnType.String,
        },
        {
          uuid: 'system-column-1-5',
          name: 'loginName',
          type: ColumnType.String,
        },
        {
          uuid: 'system-column-1-6',
          name: 'email',
          type: ColumnType.String,
          nullable: true,
        },
        {
          uuid: 'system-column-1-7',
          name: 'password',
          type: ColumnType.String,
          select: false,
        },
        {
          uuid: 'system-column-1-8',
          name: 'isSupper',
          type: ColumnType.Boolean,
          nullable: true,
        },
        {
          uuid: 'system-column-1-9',
          name: 'isDemo',
          type: ColumnType.Boolean,
          nullable: true,
        },
        {
          uuid: 'system-column-1-10',
          name: 'status',
          type: ColumnType.String,
          default: 'NORMAL',
        },
        {
          uuid: 'system-column-1-11',
          name: 'createdAt',
          type: ColumnType.Date,
          createDate: true,
        },
        {
          uuid: 'system-column-1-12',
          name: 'updatedAt',
          type: ColumnType.Date,
          updateDate: true,
        },
      ],
    },
    {
      uuid: 'system-entity-2',
      name: 'RxRole',
      columns: [
        {
          uuid: 'system-column-2-1',
          name: 'id',
          type: ColumnType.Number,
          primary: true,
          generated: true,
        },
        {
          uuid: 'system-column-2-2',
          name: 'name',
          type: ColumnType.String,
        },
        {
          uuid: 'system-column-2-3',
          name: 'description',
          type: ColumnType.String,
          nullable: true,
        },
        {
          uuid: 'system-column-2-4',
          name: 'createdAt',
          type: ColumnType.Date,
          createDate: true,
        },
        {
          uuid: 'system-column-2-5',
          name: 'updatedAt',
          type: ColumnType.Date,
          updateDate: true,
        },
      ],
    },
  ],
  diagrams: [
    {
      uuid: 'system-diagram-1',
      name: 'ER Dragram',
      nodes: [
        {
          id: 'system-entity-1',
          x: 240,
          y: 140,
          width: 200,
          height: 140,
        },
      ],
      edges: [],
    },
  ],
  relations: [
    {
      uuid: 'system-relation-1',
      relationType: RelationType.MANY_TO_MANY,
      sourceId: 'system-entity-1',
      targetId: 'system-entity-2',
      roleOnSource: 'roles',
      roleOnTarget: 'users',
    },
  ],
};
