import { Module } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';

@Module({
  controllers: [IdentificationController],
  providers: [IdentificationService]
})
export class IdentificationModule {}
