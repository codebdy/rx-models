export class CommandMeta {
  private _name: string;
  private _params: string[] = [];

  constructor(commandStr: string) {
    const nameReg = /[^(]*/i;
    this._name = nameReg.test(commandStr)
      ? commandStr.match(nameReg)[0].trim()
      : '';
    const paramReg = /\(\s*\S*\)/i;
    const paramStr = paramReg.test(commandStr)
      ? commandStr.match(paramReg)[0].replace('(', '').replace(')', '')
      : '';
    this._params = paramStr
      ? paramStr.split(',').map((token) => token.trim())
      : [];
  }

  get name() {
    return this._name;
  }

  get params() {
    return this._params;
  }
}
