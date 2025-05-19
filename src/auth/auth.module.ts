import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './controller/auth.controller';
import { UserModule } from 'src/usuario/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef( () => UserModule),
    PrismaModule,
    JwtModule,
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
