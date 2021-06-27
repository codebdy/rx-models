export class CommandMeta {
  name: string;
  value: any | any[];

  /**
   *
   * @param commandStr 命令字符串，可解析这种形式“command(x,y...)”
   * @param value 如果提供了该值，则忽略解析出来的参数，用该值代替
   */
  constructor(commandStr: string, value?: any) {
    const nameReg = /[^(]*/i;
    this.name = nameReg.test(commandStr)
      ? commandStr.match(nameReg)[0].trim()
      : '';
    const paramReg = /\([\s\S,]*\)/i;
    const paramStr = paramReg.test(commandStr)
      ? commandStr.match(paramReg)[0].replace('(', '').replace(')', '')
      : '';
    const params = paramStr
      ? paramStr.split(',').map((token) => token.trim())
      : undefined;
    this.value = params && params.length === 1 ? params[0] : params;
    if (this.value !== undefined) {
      this.value = value;
    }
  }
}
