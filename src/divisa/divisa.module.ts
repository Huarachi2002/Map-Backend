import { Module } from "@nestjs/common";
import { DivisaService } from "./services/divisa.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { DivisaController } from "./controllers/divisa.controller";

@Module({
    providers: [DivisaService],
    imports: [PrismaModule],
    exports: [DivisaService],
    controllers: [DivisaController]
})
export class DivisaModule {}