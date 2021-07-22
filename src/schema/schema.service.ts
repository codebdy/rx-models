import { Injectable } from '@nestjs/common';
import { SCHEMAS_DIR } from 'src/util/consts';
import { importJsonsFromDirectories } from 'src/util/DirectoryExportedDirectivesLoader';
import {
  EntitySchemaColumnOptions,
  EntitySchemaRelationOptions,
} from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { convertDefault } from './convert-default';
import { convertType } from './convert-type';
import { EntityMeta, EntityType } from './graph-meta-interface/entity-meta';
import { PackageMeta } from './graph-meta-interface/package-meta';
import {
  RelationMeta,
  RelationType,
} from './graph-meta-interface/relation-meta';

interface WithUuid {
  uuid: string;
}

export interface PackageSchema {
  id: number;
  uuid: string;
  name: string;
  entitySchemas: (EntitySchemaOptions<any> & WithUuid)[];
}

@Injectable()
export class SchemaService {
  private _entitySchemas: (EntitySchemaOptions<any> & WithUuid)[] = [];
  private _packages: PackageMeta[];

  constructor() {
    this.loadPublishedSchemas();
  }

  public get entitySchemas() {
    return this._entitySchemas;
  }

  public getPackageSchemas() {
    return this._packages;
  }

  public findEntitySchemaOrFailed(name: string) {
    const schema = this.getSchema(name);
    if (!schema) {
      throw new Error(`Can not find entity "${name}"`);
    }
    return schema;
  }

  public findRelationEntitySchema(entity: string, relationName: string) {
    const entitySchema = this.getSchema(entity);
    if (!entitySchema) {
      throw new Error(`Can not find entity "${entity}"`);
    }
    if (entitySchema.relations) {
      return entitySchema.relations[relationName];
    }
    return;
  }

  public getSchema(name: string) {
    return this._entitySchemas.find((schema) => schema.name === name);
  }

  public getEntityMetaOrFailed(name: string) {
    for (const aPackage of this._packages) {
      const entityMeta = aPackage.entities?.find(
        (entity) => entity.name === name,
      );
      if (entityMeta) {
        return entityMeta;
      }
    }
    throw new Error(`Can not find entity meta ${name}`);
  }

  public getEntityMetaOrFailedByUuid(entityUuid: string) {
    for (const aPackage of this._packages) {
      const entityMeta = aPackage.entities?.find(
        (entity) => entity.uuid === entityUuid,
      );
      if (entityMeta) {
        return entityMeta;
      }
    }
    throw new Error(`Can not find entity meta ${name}`);
  }

  public getRelationSchemaNameOrFailed(
    relationName: string,
    entityName: string,
  ) {
    const entitySchema = this.getSchema(entityName);
    if (!entitySchema) {
      throw new Error(`Entity ${entityName} dose not exist`);
    }
    const relations = entitySchema.relations;
    if (!relations) {
      return undefined;
    }

    if (relations[relationName]) {
      return relations[relationName].target?.toString();
    }
  }

  public getRelationEntityMetaOrFailed(
    relationName: string,
    entityName: string,
  ) {
    return this.getEntityMetaOrFailed(
      this.getRelationSchemaNameOrFailed(relationName, entityName),
    );
  }

  private loadPublishedSchemas() {
    const entityMetas: EntityMeta[] = [];
    const relationMetas: RelationMeta[] = [];
    const packages: PackageMeta[] = importJsonsFromDirectories([
      SCHEMAS_DIR + '*.json',
    ]);

    this._packages = packages;

    packages.forEach((aPackage) => {
      entityMetas.push(
        ...(aPackage.entities.filter(
          (entity) => entity.entityType !== EntityType.enum,
        ) || []),
      );
      relationMetas.push(...(aPackage.relations || []));
    });

    entityMetas.forEach((entityMeta) => {
      const columns: {
        [key: string]: EntitySchemaColumnOptions & WithUuid;
      } = {};
      const relations: {
        [key: string]: EntitySchemaRelationOptions & WithUuid;
      } = {};
      for (const column of entityMeta.columns) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, type, ...rest } = column;
        columns[column.name] = {
          ...rest,
          type: convertType(column.type),
          default: convertDefault(column),
        };
      }

      for (const relation of relationMetas) {
        if (relation.sourceId === entityMeta.uuid) {
          relations[relation.roleOnSource] = {
            uuid: relation.uuid,
            target: entityMetas.find(
              (entity) => entity.uuid === relation.targetId,
            )?.name,
            type: relation.relationType,
            inverseSide: relation.roleOnTarget,
            joinTable:
              relation.relationType === RelationType.MANY_TO_MANY &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
            joinColumn:
              relation.relationType === RelationType.ONE_TO_ONE &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
          };
        }
        if (relation.targetId === entityMeta.uuid) {
          let relationType = relation.relationType;
          if (relation.relationType === RelationType.ONE_TO_MANY) {
            relationType = RelationType.MANY_TO_ONE;
          }
          if (relation.relationType === RelationType.MANY_TO_ONE) {
            relationType = RelationType.ONE_TO_MANY;
          }
          relations[relation.roleOnTarget] = {
            uuid: relation.uuid,
            target: entityMetas.find(
              (entity) => entity.uuid === relation.sourceId,
            )?.name,
            type: relationType,
            inverseSide: relation.roleOnSource,
            joinTable:
              relationType === RelationType.MANY_TO_MANY &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
            joinColumn:
              relationType === RelationType.ONE_TO_ONE &&
              relation.ownerId === entityMeta.uuid
                ? true
                : undefined,
          };
        }
      }

      const entitySchemaOption: EntitySchemaOptions<any> & WithUuid = {
        uuid: entityMeta.uuid,
        name: entityMeta.name,
        columns: columns,
        relations: relations,
      };

      this._entitySchemas.push(entitySchemaOption);
    });
  }
}
