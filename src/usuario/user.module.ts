import { forwardRef, Module } from '@nestjs/common';
import { ClienteService, EmpleadoService, UserService } from './services';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClienteController, EmpleadoController, UserController } from './controllers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UserService, ClienteService, EmpleadoService ],
  imports: [
    PrismaModule,
    forwardRef( () => AuthModule),
  ],  
  exports: [
    UserService,
    ClienteService,
    EmpleadoService,
  ],
  controllers: [UserController, ClienteController, EmpleadoController]
})
export class UserModule {}
