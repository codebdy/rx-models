import _ = require('lodash');

export class MailTeller {
  localMailList: string[] = [];
  newMailList: string[] = [];
  protected uidlData: string[];
  sizeList: string[] = [];

  totalNew: number;

  currentMailIndex = 0;

  /**
   * 识别新邮件
   */
  tellIt(uidlData: string[], startIndex = 1): void {
    this.uidlData = uidlData;
    this.newMailList = _.difference(this.uidlData, this.localMailList).splice(
      startIndex,
    );
    this.totalNew = this.newMailList.length;
    this.currentMailIndex = 0;
  }

  getUidl(msg: string): string {
    return this.uidlData[msg];
  }

  getMsgNumber(uidl: string): string {
    for (const msg in this.uidlData) {
      if (this.uidlData[msg] === uidl) {
        return msg;
      }
    }
  }

  nextMsgNumber(): string {
    if (this.newMailList.length > 0) {
      const uidl = this.newMailList.shift();
      return this.getMsgNumber(uidl);
    }
  }

  cunrrentNumber(): number {
    return this.totalNew - this.newMailList.length;
  }
}
