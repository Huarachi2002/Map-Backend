import { Injectable } from "@nestjs/common";
import { CriptoMonedas } from "@prisma/client";
import { QueryCommonDto } from "src/common/dto";
import { PrismaService } from "src/prisma/services";


@Injectable()
export class CriptoMonedaService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async findAll({
        search,
        skip,
        limit
    }: QueryCommonDto): Promise<CriptoMonedas[]> {
        const criptomonedas = await this.prismaService.criptoMonedas.findMany({
            where: {
                nombre: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            skip,
            take: limit
        });
        return criptomonedas;
    }

    public async findById(id: string): Promise<CriptoMonedas>{
        const criptomoneda = await this.prismaService.criptoMonedas.findUnique({
            where: {
                id
            },
        });

        if (!criptomoneda) {
            throw new Error(`Criptomoneda with id ${id} not found`);
        }

        return criptomoneda;
    }
}