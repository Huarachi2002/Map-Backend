import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './usuario/user.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, envSchema } from './configuration';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { EntidadOperadoraModule } from './entidad-operadora/entidad-operadora.module';

@Module({  imports: [
    PrismaModule, 
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      validationSchema: envSchema
    }),
    CommonModule,
    AuthModule,
    EntidadOperadoraModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
