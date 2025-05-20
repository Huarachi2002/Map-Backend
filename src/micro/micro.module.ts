import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { MicroService } from './services/micro.service';
import { MicroController } from './controllers/micro.controller';

@Module({
  providers: [MicroService],
  imports: [
    PrismaModule,
    forwardRef( () => AuthModule),
  ],  exports: [
    MicroService,
  ],
  controllers: [MicroController]
})
export class MicroModule {}
