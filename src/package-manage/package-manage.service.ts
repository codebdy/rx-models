import { Injectable } from '@nestjs/common';
import { PackageMeta } from 'src/meta/entity/package-meta';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';
import { RxPackage } from 'src/util/consts';
import { PlatformTools } from 'typeorm/platform/PlatformTools';

const schemasDir = 'schemas/';

@Injectable()
export class PackageManageService {
  constructor(private readonly typeormSerivce: TypeOrmWithSchemaService) {}

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

  public async publishPackage(aPackage: PackageMeta) {
    if (!PlatformTools.fileExist(schemasDir)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      await fs.promises.mkdir(PlatformTools.pathResolve(schemasDir));
    }

    PlatformTools.writeFile(
      schemasDir + aPackage.uuid + '.json',
      JSON.stringify(aPackage, null, 2),
    );

    await this.typeormSerivce.restart();
  }
}
