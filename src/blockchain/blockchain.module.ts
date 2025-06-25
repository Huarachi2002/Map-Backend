import { forwardRef, Module } from '@nestjs/common';
import { BlockchainService } from './services/blockchain.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [BlockchainService],
  imports: [
    HttpModule,
    PrismaModule,
    forwardRef( () => AuthModule),
  ],
  exports: [
    BlockchainService,
  ],
})
export class BlockchainModule {}