import { Injectable } from '@nestjs/common';
import { PackageMeta } from 'src/schema/meta-interface/package-meta';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { RxPackage, SCHEMAS_DIR } from 'src/util/consts';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
@Injectable()
export class PackageManageService {
  constructor(private readonly typeormSerivce: TypeOrmService) {}

  public async savePackage(aPackage: PackageMeta) {
    const packageRepository = this.typeormSerivce.connection.getRepository<PackageMeta>(
      RxPackage,
    );
    let systemPackage = await packageRepository.findOne({
      where: { uuid: aPackage.uuid },
    });

    if (!systemPackage) {
      systemPackage = packageRepository.create();
    }

    systemPackage.uuid = aPackage.uuid;
    systemPackage.name = aPackage.name;
    systemPackage.status = aPackage.status;
    systemPackage.entities = aPackage.entities;
    systemPackage.diagrams = aPackage.diagrams;
    systemPackage.relations = aPackage.relations;

    await packageRepository.save(systemPackage);
  }

  public async publishPackages(packages: PackageMeta[]) {
    if (!PlatformTools.fileExist(SCHEMAS_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      await fs.promises.mkdir(PlatformTools.pathResolve(SCHEMAS_DIR));
    }

    for (const aPackage of packages) {
      await PlatformTools.writeFile(
        SCHEMAS_DIR + aPackage.uuid + '.json',
        JSON.stringify(aPackage, null, 2),
      );
    }

    await this.typeormSerivce.restart();
  }

  //public getAllPublishedPackages(): PackageMeta[] {
  //  const packages = importJsonsFromDirectories([SCHEMAS_DIR]);
  //  return packages;
  //}
}
