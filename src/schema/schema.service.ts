import { Injectable } from '@nestjs/common';
import { SCHEMAS_DIR } from 'src/util/consts';
import { importJsonsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import {
  EntitySchemaColumnOptions,
  EntitySchemaRelationOptions,
} from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { convertType } from './convert-type';
import { EntityMeta } from './graph-meta-interface/entity-meta';
import { PackageMeta } from './graph-meta-interface/package-meta';
import { RelationMeta, RelationType } from './graph-meta-interface/relation-meta';
import { predefinedSchemas } from './predefined';

@Injectable()
export class SchemaService {
  private _entitySchemas: EntitySchemaOptions<any>[] = [];

  constructor() {
    this.loadPredefinedSchemas();
    this.loadPublishedSchemas();
  }

  public get entitySchemas() {
    return this._entitySchemas;
  }
  public findEntitySchemaOrFailed(name: string) {
    const schema = this.getSchema(name);
    if (!schema) {
      throw new Error(`Can not find model "${name}"`);
    }
    return schema;
  }

  public findRelationEntitySchema(model: string, relationName: string) {
    const entitySchema = this.getSchema(model);
    if (entitySchema.relations) {
      return entitySchema.relations[relationName];
    }
    return;
  }

  public getSchema(name: string) {
    return this._entitySchemas.find((schema) => schema.name === name);
  }

  private loadPredefinedSchemas() {
    predefinedSchemas.forEach((schema: EntitySchemaOptions<any>) => {
      this._entitySchemas.push(schema);
    });
  }

  private loadPublishedSchemas() {
    const entityMetas: EntityMeta[] = [];
    const relationMetas: RelationMeta[] = [];
    const packages: PackageMeta[] = importJsonsFromDirectories([
      SCHEMAS_DIR + '*.json',
    ]);

    packages.forEach((aPackage) => {
      entityMetas.push(...(aPackage.entities || []));
      relationMetas.push(...(aPackage.relations || []));
    });

    entityMetas.forEach((entityMeta) => {
      const columns: { [key: string]: EntitySchemaColumnOptions } = {};
      const relations: { [key: string]: EntitySchemaRelationOptions } = {};
      for (const column of entityMeta.columns) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, type, uuid, ...rest } = column;
        columns[column.name] = {
          ...rest,
          type: convertType(column.type),
        };
      }

      for (const relation of relationMetas) {
        if (relation.sourceId === entityMeta.uuid) {
          relations[relation.roleOnSource] = {
            target: entityMeta.name,
            type: relation.relationType,
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
          relations[relation.roleOnSource] = {
            target: entityMeta.name,
            type: relationType,
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

      const entitySchemaOption: EntitySchemaOptions<any> = {
        name: entityMeta.name,
        columns: columns,
        relations: relations,
      };

      this._entitySchemas.push(entitySchemaOption);
    });
  }
}
