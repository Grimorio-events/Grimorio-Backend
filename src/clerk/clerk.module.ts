import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Module({
  imports: [],
  providers: [ClerkService],
  controllers: [],
  exports: [ClerkService],
})
export class ClerkModule {}
