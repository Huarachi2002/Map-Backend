import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { RutaService } from './services/ruta.service';
import { RutaController } from './controllers/ruta.controller';

@Module({
  providers: [RutaService],
  imports: [
    PrismaModule,
    forwardRef( () => AuthModule),
  ],  
  exports: [
    RutaService,
  ],
  controllers: [RutaController]
})
export class RutaModule {}
