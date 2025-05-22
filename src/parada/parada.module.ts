import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ParadaService } from './services/parada.service';
import { ParadaController } from './controllers/parada.controller';

@Module({
  providers: [ParadaService],
  imports: [
    PrismaModule,
    forwardRef( () => AuthModule),
  ],  exports: [
    ParadaService,
  ],
  controllers: [ParadaController]
})
export class ParadaModule {}
