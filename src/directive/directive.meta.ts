export class DirectiveMeta {
  name: string;
  value: any | any[];

  /**
   *
   * @param directiveStr 命令字符串，可解析这种形式“directive(x,y...)”
   * @param value 如果提供了该值，则忽略解析出来的参数，用该值代替
   */
  constructor(directiveStr: string, value?: any) {
    const nameReg = /[^(]*/i;
    this.name = nameReg.test(directiveStr)
      ? directiveStr.match(nameReg)[0].trim()
      : '';
    const paramReg = /\([\s\S,]*\)/i;
    const paramStr = paramReg.test(directiveStr)
      ? directiveStr.match(paramReg)[0].replace('(', '').replace(')', '')
      : '';
    const params = paramStr
      ? paramStr.split(',').map((token) => token.trim())
      : undefined;
    this.value = params && params.length === 1 ? params[0] : params;
    if (value !== undefined) {
      this.value = value;
    }
  }
}
