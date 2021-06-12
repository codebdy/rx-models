import { getRepository } from 'typeorm';

export function getRelationModel(key: string, model: string) {
  const repository = getRepository(model);
  //const relationCommand = getRlationCommand();
  for (const relation of repository.metadata.relations) {
    if (relation.propertyName === key) {
      return relation.inverseEntityMetadata.name;
    }
  }

  return undefined;
}
