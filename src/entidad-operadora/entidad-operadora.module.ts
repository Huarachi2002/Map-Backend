import { Module } from '@nestjs/common';
import { EntidadOperadoraService } from './services';
import { EntidadOperadoraController } from './controllers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/usuario/user.module';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [EntidadOperadoraService],
  imports: [UserModule, PrismaModule, BlockchainModule, HttpModule],
  exports: [EntidadOperadoraService],
  controllers: [EntidadOperadoraController]
})
export class EntidadOperadoraModule {}
