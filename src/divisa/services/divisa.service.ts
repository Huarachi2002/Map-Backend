import { Injectable } from "@nestjs/common";
import { Divisa } from "@prisma/client";
import { QueryCommonDto } from "src/common/dto";
import { PrismaService } from "src/prisma/services";


@Injectable()
export class DivisaService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async findAll({
        search,
        skip,
        limit
    }: QueryCommonDto): Promise<Divisa[]> {
        const divisas = await this.prismaService.divisa.findMany({
            where: {
                nombre: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            skip,
            take: limit
        });
        return divisas;
    }

    public async findById(id: string): Promise<Divisa>{
        const divisa = await this.prismaService.divisa.findUnique({
            where: {
                id
            },
        });

        if (!divisa) {
            throw new Error(`Divisa with id ${id} not found`);
        }

        return divisa;
    }
}