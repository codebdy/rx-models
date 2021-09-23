import { TOKEN_ENTITY } from './tokens';
import { parseDirectives } from './parse-directives';
import { DirectiveMeta } from 'directive/directive.meta';

export class JsonUnit {
  key = '';
  directives: DirectiveMeta[] = [];
  value: any;
  constructor(keyStr: string, value: any) {
    const [key, directives] = parseDirectives(keyStr);
    this.key = key;
    this.directives = directives;
    this.value = value;
  }

  getDirective(directiveName: string) {
    for (const directive of this.directives) {
      if (directive.name === directiveName) {
        return directive;
      }
    }
    return undefined;
  }

  isModel() {
    return this.key.toLowerCase() === TOKEN_ENTITY;
  }
}
