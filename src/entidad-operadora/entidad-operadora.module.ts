import { forwardRef, Module } from '@nestjs/common';
import { EntidadOperadoraService } from './services';
import { EntidadOperadoraController } from './controllers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/usuario/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [EntidadOperadoraService],
  imports: [UserModule, forwardRef(() => AuthModule), PrismaModule],
  exports: [EntidadOperadoraService],
  controllers: [EntidadOperadoraController]
})
export class EntidadOperadoraModule {}
