import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MagicModule } from './magic/magic.module';
import { TypeOrmModule } from './typeorm/typeorm.module';
import { InstallModule } from './install/install.module';
import { PackageManageModule } from './package-manage/package-manage.module';
import { MailerModule } from './mailer/mailer.module';
import { StorageModule } from './storage/storage.module';
import { RxBaseModule } from './rxbase/rxbase.module';

@Module({
  imports: [
    PackageManageModule,
    InstallModule,
    TypeOrmModule,
    StorageModule,
    AuthModule,
    MagicModule,
    MailerModule,
    RxBaseModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
