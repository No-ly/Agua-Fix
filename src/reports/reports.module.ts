import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Report } from './entities/report.entity';
import { User } from '../auth/entities/user.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { EmailModule } from '../email/email.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, User]),
    EmailModule,
    StorageModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
