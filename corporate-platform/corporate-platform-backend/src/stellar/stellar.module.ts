import { Module } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { TransferService } from './transfer.service';
import { StellarController } from './stellar.controller';

@Module({
  controllers: [StellarController],
  providers: [StellarService, TransferService],
  exports: [StellarService, TransferService],
})
export class StellarModule {}
