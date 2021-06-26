export class CommandMeta {
  name: string;
  params: string[] = [];

  constructor(commandStr: string) {
    const nameReg = /[^(]*/i;
    this.name = nameReg.test(commandStr)
      ? commandStr.match(nameReg)[0].trim()
      : '';
    const paramReg = /\([\s\S,]*\)/i;
    const paramStr = paramReg.test(commandStr)
      ? commandStr.match(paramReg)[0].replace('(', '').replace(')', '')
      : '';
    this.params = paramStr
      ? paramStr.split(',').map((token) => token.trim())
      : [];
  }

  getFistNumberParam() {
    return this.params.length ? parseInt(this.params[0]) : 0;
  }
}
