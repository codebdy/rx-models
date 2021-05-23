import { CommandMeta } from './command-meta';
import { JsonUnitMeta } from './json-unit-meta';
import { parseCommands } from './parse-commands';

export class ModelUnitMeta extends JsonUnitMeta {
  value: string;
  constructor(key: string, commands: CommandMeta[], valueStr: string) {
    super(key, commands);
    if (!valueStr) {
      throw new Error('Miss Model name');
    }
    const [value, otherCommands] = parseCommands(valueStr);
    this.value = value;
    this.commands.concat(otherCommands);
  }

  get model() {
    return this.value;
  }

  get modelAlias() {
    return this.model?.toLowerCase();
  }
}
