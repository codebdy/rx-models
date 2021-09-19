import { Injectable } from '@nestjs/common';

@Injectable()
export class RxBaseService {
  private host: string;

  setHost(host: string) {
    this.host = host;
  }

  getHost() {
    return this.host;
  }
}
