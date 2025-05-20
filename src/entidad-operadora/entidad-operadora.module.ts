import { Module } from '@nestjs/common';
import { EntidadOperadoraService } from './services';
import { EntidadOperadoraController } from './controllers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/usuario/user.module';

@Module({
  providers: [EntidadOperadoraService],
  imports: [UserModule, PrismaModule],
  exports: [EntidadOperadoraService],
  controllers: [EntidadOperadoraController]
})
export class EntidadOperadoraModule {}
