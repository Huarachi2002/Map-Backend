import { Module } from "@nestjs/common";
import { DivisaService } from "./services/divisa.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { DivisaController } from "./controllers/divisa.controller";
import { CriptoMonedaService } from "./services/criptomoneda.service";
import { CriptomonedaController } from "./controllers/criptomoneda.controller";

@Module({
    providers: [DivisaService, CriptoMonedaService],
    imports: [PrismaModule],
    exports: [DivisaService, CriptoMonedaService],
    controllers: [DivisaController, CriptomonedaController]
})
export class DivisaModule {}