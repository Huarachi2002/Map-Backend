import { PrismaClient } from '@prisma/client';
import * as bycrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(){
    console.log("Seeding database...");

    // 1. Crear Divisas
    console.log("Creating Divisas...");
    const divisasBOB = await prisma.divisa.upsert({
        where: { simbolo: 'BOB' },
        update: {},
        create: {
            pais: 'Bolivia',
            nombre: 'Boliviano',
            simbolo: 'BOB',
        }
    });

    const divisasUSD = await prisma.divisa.upsert({
        where: { simbolo: 'USD' },
        update: {},
        create: {
            pais: 'Estados Unidos',
            nombre: 'Dólar Estadounidense',
            simbolo: 'USD',
        }
    });
    
    await prisma.divisa.create({
        data: {
            pais: 'Argentina',
            nombre: 'Peso Argentino',
            simbolo: 'ARS',
        }
    });

    await prisma.divisa.create({
        data: {
            pais: 'Brasil',
            nombre: 'Real Brasileño',
            simbolo: 'BRL',
        }
    });

    await prisma.divisa.create({
        data: {
            pais: 'Chile',
            nombre: 'Peso Chileno',
            simbolo: 'CLP',
        }
    });

    await prisma.divisa.create({
        data: {
            pais: 'Paraguay',
            nombre: 'Guaraní Paraguayo',
            simbolo: 'PYG',
        }
    });

    await prisma.divisa.create({
        data: {
            pais: 'Perú',
            nombre: 'Sol Peruano',
            simbolo: 'PEN',
        }
    });

    await prisma.divisa.create({
        data: {
            pais: 'Uruguay',
            nombre: 'Peso Uruguayo',
            simbolo: 'UYU',
        }
    });

    await prisma.divisa.create({
        data: {
            pais: 'Venezuela',
            nombre: 'Bolívar Venezolano',
            simbolo: 'VES',
        }
    });

    // 2. Crear Entidades Operadoras
    console.log("Creating Entidades Operadoras...");
    const entidadOperadora1 = await prisma.entidadOperadora.create({
        data: {
            nombre: 'Transporte La Paz S.A.',
            tipo: 'COOPERATIVA',
            direccion: 'Av. Arce #2525, La Paz',
            latitud: -17.783399,
            longitud: -63.182099,
            cobro_pasaje: 2.5,
            correo_contacto: 'info@transporte-lapaz.com',
            wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
            saldo_ingresos: 0,
            estado: true,
            id_divisa: divisasBOB.id,
        }
    });

    const entidadOperadora2 = await prisma.entidadOperadora.create({
        data: {
            nombre: 'Micro sur express',
            tipo: 'EMPRESA',
            direccion: 'Calle comercio #123, Santa Cruz',
            latitud: -17.783399,
            longitud: -63.182099,
            cobro_pasaje: 3.5,
            correo_contacto: 'info@microsur.com',
            wallet_address: '0xabcdefabcdefabcdefabcdefabcdefabcdef',
            saldo_ingresos: 0,
            estado: true,
            id_divisa: divisasUSD.id,
        }
    });

    // 3. Crear usuarios y clientes
    console.log("Creating Usuarios and Clientes...");
    const usuarioCliente1 = await prisma.usuario.create({
        data: {
            nombre: 'Juan Perez',
            correo: 'juan.perez@example.com',
            contrasena: await bycrypt.hash('12345678', 10),
            tipo: 'CLIENTE',
            cliente: {
                create: {
                    wallet_address: '0xabcdefabcdefabcdefabcdefabcdefabcdef',
                    id_divisa: divisasBOB.id,
                }
            }
        },
        include: {cliente: true}
    });

    const usuarioCliente2 = await prisma.usuario.create({
        data: {
            nombre: 'María González',
            correo: 'maria.gonzalez@email.com',
            contrasena: bycrypt.hashSync('password123', 10),
            tipo: 'CLIENTE',
            cliente: {
                create: {
                wallet_address: '0xfedcba098765432109876543210987654321fedc',
                id_divisa: divisasBOB.id
                }
            }
        },
        include: { cliente: true }
    });

    // 4. Crear Usuarios Empleados
    console.log('👨‍💼 Creando usuarios empleados...');
    const usuarioEmpleado1 = await prisma.usuario.create({
        data: {
            nombre: 'Carlos Mamani',
            correo: 'carlos.mamani@transportelapaz.com',
            contrasena: bycrypt.hashSync('empleado123', 10),
            tipo: 'EMPLEADO',
            empleado: {
                create: {
                tipo: 'CHOFER',
                id_entidad: entidadOperadora1.id
                }
            }
        },
        include: { empleado: true }
    });

    const usuarioEmpleado2 = await prisma.usuario.create({
        data: {
            nombre: 'Ana Quispe',
            correo: 'ana.quispe@transportelapaz.com',
            contrasena: bycrypt.hashSync('admin123', 10),
            tipo: 'EMPLEADO',
            empleado: {
                create: {
                tipo: 'ADMIN',
                id_entidad: entidadOperadora1.id
                }
            }
        },
        include: { empleado: true }
    });

    // 5. Crear Rutas
    console.log('🛣️ Creando rutas...');
    const ruta1 = await prisma.ruta.create({
        data: {
            nombre: 'Ruta 1 - Centro-Sur',
            descripcion: 'Ruta que conecta el centro de la ciudad con la zona sur',
            origenLat: '-16.5000',
            origenLong: '-68.1193',
            destinoLat: '-16.5300',
            destinoLong: '-68.1000',
            vertices: JSON.stringify([
                [-16.5000, -68.1193],
                [-16.5100, -68.1150],
                [-16.5200, -68.1100],
                [-16.5300, -68.1000]
            ]),
            distancia: 15.5,
            tiempo: 45.0,
            id_entidad: entidadOperadora1.id
        }
    });

    // 6. Crear Paradas
    console.log('🚏 Creando paradas...');
    await prisma.parada.createMany({
        data: [
            {
                nombre: 'Plaza San Francisco',
                latitud: -16.5000,
                longitud: -68.1193,
                tiempo: 2.0,
                id_ruta: ruta1.id
            },
            {
                nombre: 'Av. Mariscal Santa Cruz',
                latitud: -16.5100,
                longitud: -68.1150,
                tiempo: 3.0,
                id_ruta: ruta1.id
            },
            {
                nombre: 'Plaza del Estudiante',
                latitud: -16.5200,
                longitud: -68.1100,
                tiempo: 2.5,
                id_ruta: ruta1.id
            }
        ]
    });

    // 7. Crear Micros
    console.log("Creando Micros...");
    const micro1 = await prisma.micro.create({
        data: {
            placa: 'LAP-1234',
            color: 'Azul',
            estado: true,
            id_entidad: entidadOperadora1.id,
            id_ruta: ruta1.id,
            id_empleado: usuarioEmpleado1.empleado?.id
        }
    })

    // 8. Crear Tarjetas para Clientes
    console.log('💳 Creando tarjetas...');
    await prisma.tarjeta.createMany({
        data: [
            {
                tipo_tarjeta: 'VIRTUAL',
                nfc_id: 'NFC001',
                saldo_actual: 50.0,
                id_cliente: usuarioCliente1.cliente.id
            },
            {
                tipo_tarjeta: 'VIRTUAL',
                nfc_id: 'NFC002',
                saldo_actual: 100.0,
                id_cliente: usuarioCliente2.cliente.id
            }
        ]
    });
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });