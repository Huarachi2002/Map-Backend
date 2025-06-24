import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlockchainService } from './services/blockchain.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
  ],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}