import { ImageSize } from 'src/util/consts';
import { cacheSize, expaireTime, refetchPeriod } from './consts';

export interface UrlInfo {
  time: Date;
  path: string;
  bucket: string;
  size?: ImageSize;
  url: string;
}
class UrlCache {
  private urls: UrlInfo[] = [];

  addUrl(urlInfo: UrlInfo) {
    this.urls.push(urlInfo);
    if (this.urls.length > cacheSize) {
      this.urls.shift();
    }
  }

  getUrlInfo(path: string, bucket: string, size?: ImageSize) {
    const urlInfo = this.urls.find(
      (url) =>
        url.path === path &&
        url.bucket === bucket &&
        (url.size === size ||
          (url.size &&
            url.size.height === size?.height &&
            size.width === size?.width)),
    );

    if (!urlInfo) {
      return urlInfo;
    }
    const now = new Date();
    const age = (now.getTime() - urlInfo.time.getTime()) / 1000;
    //已过期
    if (expaireTime - age < refetchPeriod) {
      this.urls.slice(this.urls.indexOf(urlInfo), 1);
      return undefined;
    }

    return urlInfo;
  }
}

export const urlCache = new UrlCache();
