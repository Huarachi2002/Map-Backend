import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './usuario/user.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, envSchema } from './configuration';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { EntidadOperadoraModule } from './entidad-operadora/entidad-operadora.module';
import { RutaModule } from './ruta/ruta.module';
import { MicroModule } from './micro/micro.module';
import { SocketModule } from './socket/socket.module';
import { ParadaModule } from './parada/parada.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { TarjetaModule } from './tarjeta/tarjeta.module';

@Module({  imports: [
    PrismaModule, 
    SocketModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      validationSchema: envSchema
    }),
    CommonModule,
    AuthModule,
    EntidadOperadoraModule,
    RutaModule,
    MicroModule,
    ParadaModule,
    BlockchainModule,
    TarjetaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
