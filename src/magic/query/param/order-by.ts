export class OrderBy {
  private _orderArray: string[];

  constructor(orderArray: string[]) {
    this._orderArray = orderArray;
  }

  getpMap(modelAlias: string) {
    if (this._orderArray.length === 0) {
      return undefined;
    }
    const orderMap = {} as any;
    for (const oneOrder of this._orderArray) {
      const oneOrderArray = oneOrder.split(' ').filter((key) => key.trim());
      if (oneOrderArray.length > 0) {
        orderMap[modelAlias + '.' + oneOrderArray[0]] = 'ASC';
      }
      if (oneOrderArray.length > 1) {
        orderMap[
          modelAlias + '.' + oneOrderArray[0]
        ] = oneOrderArray[1].toUpperCase();
      }
    }
    return orderMap;
  }
}
