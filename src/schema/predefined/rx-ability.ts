import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
export enum AbilityType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const RxAbilitySchema: EntitySchemaOptions<any> = {
  name: 'RxAbility',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    entityUuid: {
      type: String,
    },
    columnUuid: {
      type: String,
      nullable: true,
    },
    abilityType: {
      type: 'enum',
      enum: AbilityType,
      default: AbilityType.READ,
    },
    can: {
      type: Boolean,
    },
    expression: {
      type: String,
    },
  },
  relations: {
    role: {
      type: 'many-to-one',
      target: 'RxRole',
    },
  },
};
