import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { AuthModule } from 'src/auth/auth.module';
import { TarjetaService } from './services/tarjeta.service';
import { TarjetaController } from './controllers/tarjeta.controller';

@Module({
  imports: [
    PrismaModule,
    BlockchainModule,
    AuthModule,
  ],
  providers: [TarjetaService],
  controllers: [TarjetaController],
  exports: [TarjetaService],
})
export class TarjetaModule {}