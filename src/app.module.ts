import { Module } from '@nestjs/common';
import { IdentificationModule } from './api/identification/identification.module';
@Module({
	imports: [IdentificationModule]
})
export class AppModule {}
