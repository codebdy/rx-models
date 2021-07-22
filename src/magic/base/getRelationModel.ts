import { getRepository } from 'typeorm';

export function getRelationModel(key: string, model: string) {
  const repository = getRepository(model);
  for (const relation of repository.metadata.relations) {
    if (relation.propertyName === key) {
      return relation.inverseEntityMetadata.name;
    }
  }

  return undefined;
}
