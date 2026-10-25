import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from './db/data-source';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { EmailModule } from './email/email.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    ReportsModule,
    EmailModule,
    StorageModule,
  ],
})
export class AppModule {}
