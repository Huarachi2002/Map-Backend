import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(){
    try {
        // Limpiar datos existentes en orden correcto (respetando foreign keys)
        console.log("🧹 Limpiando datos existentes...");
        await prisma.tarjeta.deleteMany({});
        await prisma.parada.deleteMany({});
        await prisma.micro.deleteMany({});
        await prisma.ruta.deleteMany({});
        await prisma.empleado.deleteMany({});
        await prisma.cliente.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.entidadOperadora.deleteMany({});
        await prisma.criptoMonedas.deleteMany({});
        await prisma.divisa.deleteMany({});

        // 1. Crear Divisas
        console.log("💰 Creando divisas...");
        const divisas = await Promise.all([
            prisma.divisa.create({
                data: { pais: 'Bolivia', nombre: 'Boliviano', simbolo: 'BOB' }
            }),
            prisma.divisa.create({
                data: { pais: 'Estados Unidos', nombre: 'Dólar Estadounidense', simbolo: 'USD' }
            }),
            prisma.divisa.create({
                data: { pais: 'Argentina', nombre: 'Peso Argentino', simbolo: 'ARS' }
            }),
            prisma.divisa.create({
                data: { pais: 'Brasil', nombre: 'Real Brasileño', simbolo: 'BRL' }
            }),
            prisma.divisa.create({
                data: { pais: 'Chile', nombre: 'Peso Chileno', simbolo: 'CLP' }
            }),
            prisma.divisa.create({
                data: { pais: 'Paraguay', nombre: 'Guaraní Paraguayo', simbolo: 'PYG' }
            }),
            prisma.divisa.create({
                data: { pais: 'Perú', nombre: 'Sol Peruano', simbolo: 'PEN' }
            }),
            prisma.divisa.create({
                data: { pais: 'Uruguay', nombre: 'Peso Uruguayo', simbolo: 'UYU' }
            }),
            prisma.divisa.create({
                data: { pais: 'Venezuela', nombre: 'Bolívar Venezolano', simbolo: 'VES' }
            })
        ]);

        const [divisasBOB, divisasUSD] = divisas;

        // 2. Crear Criptomonedas
        console.log("₿ Creando criptomonedas...");
        const criptomonedas = [
            { nombre: "Bitcoin", simbolo: "BTC" },
            { nombre: "Ethereum", simbolo: "ETH" },
            { nombre: "Tether", simbolo: "USDT" },
            { nombre: "Binance Coin", simbolo: "BNB" },
            { nombre: "Dogecoin", simbolo: "DOGE" },
        ];

        await prisma.criptoMonedas.createMany({
            data: criptomonedas.map(cripto => ({
                nombre: cripto.nombre,
                simbolo: cripto.simbolo,
                estado: true
            }))
        });

        // 3. Crear Entidades Operadoras
        console.log("🏢 Creando entidades operadoras...");
        const entidadOperadora1 = await prisma.entidadOperadora.create({
            data: {
                nombre: 'Transporte La Paz S.A.',
                tipo: 'COOPERATIVA',
                direccion: 'Av. Arce #2525, La Paz',
                latitud: -17.783399,
                longitud: -63.182099,
                cobro_pasaje: 2.5,
                correo_contacto: `transporte.lapaz.${Date.now()}@example.com`, // Email único
                wallet_address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`, // Wallet único
                saldo_ingresos: 0,
                estado: true,
                id_divisa: divisasBOB.id,
            }
        });

        const entidadOperadora2 = await prisma.entidadOperadora.create({
            data: {
                nombre: 'Micro Sur Express',
                tipo: 'EMPRESA',
                direccion: 'Calle Comercio #123, Santa Cruz',
                latitud: -17.783399,
                longitud: -63.182099,
                cobro_pasaje: 3.5,
                correo_contacto: `microsur.${Date.now()}@example.com`, // Email único
                wallet_address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`, // Wallet único
                saldo_ingresos: 0,
                estado: true,
                id_divisa: divisasUSD.id,
            }
        });

        // 4. Crear usuarios y clientes
        console.log("👥 Creando usuarios clientes...");
        const timestamp = Date.now();
        
        const usuarioCliente1 = await prisma.usuario.create({
            data: {
                nombre: 'Juan Pérez',
                correo: `juan.perez@example.com`, // Email único
                contrasena: await bcrypt.hash('12345678', 10),
                tipo: 'CLIENTE',
                cliente: {
                    create: {
                        wallet_address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`, // Wallet único
                        id_divisa: divisasBOB.id,
                    }
                }
            },
            include: { cliente: true }
        });

        const usuarioCliente2 = await prisma.usuario.create({
            data: {
                nombre: 'María González',
                correo: `maria.gonzalez@example.com`, // Email único
                contrasena: await bcrypt.hash('12345678', 10),
                tipo: 'CLIENTE',
                cliente: {
                    create: {
                        wallet_address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`, // Wallet único
                        id_divisa: divisasBOB.id
                    }
                }
            },
            include: { cliente: true }
        });

        // 5. Crear Usuarios Empleados
        console.log('👨‍💼 Creando usuarios empleados...');
        const usuarioEmpleado1 = await prisma.usuario.create({
            data: {
                nombre: 'Carlos Mamani',
                correo: `carlos.mamani@example.com`, // Email único
                contrasena: await bcrypt.hash('12345678', 10),
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
                correo: `ana.quispe@example.com`, // Email único
                contrasena: await bcrypt.hash('12345678', 10),
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

        // 6. Crear Rutas
        console.log('🛣️ Creando rutas...');
        const ruta1 = await prisma.ruta.create({
            data: {
                nombre: 'Ruta 1 - Centro-Sur',
                descripcion: 'Ruta que conecta el centro de la ciudad con la zona sur',
                origenLat: '-17.77360038',
                origenLong: '-63.19163402',
                destinoLat: '-17.76015913',
                destinoLong: '-63.17922175',
                vertices: JSON.stringify([
                    {lat: -17.77360038, lng: -63.19163402},
                    {lat: -17.77371559, lng: -63.19171841},
                    {lat: -17.77374654, lng: -63.19144214},
                    {lat: -17.77352546, lng: -63.19128195},
                    {lat: -17.77316511, lng: -63.19100105},
                    {lat: -17.77288877, lng: -63.19063192},
                    {lat: -17.77270306, lng: -63.19026976},
                    {lat: -17.77225870, lng: -63.18910202},
                    {lat: -17.77209511, lng: -63.18848681},
                    {lat: -17.77190056, lng: -63.18803875},
                    {lat: -17.77160874, lng: -63.18729353},
                    {lat: -17.77100520, lng: -63.18525521},
                    {lat: -17.77060726, lng: -63.18382049},
                    {lat: -17.77049451, lng: -63.18308688},
                    {lat: -17.77056083, lng: -63.18242060},
                    {lat: -17.76966988, lng: -63.18245078},
                    {lat: -17.76878335, lng: -63.18239042},
                    {lat: -17.76806484, lng: -63.18225577},
                    {lat: -17.76714735, lng: -63.18196325},
                    {lat: -17.76586728, lng: -63.18147573},
                    {lat: -17.76494978, lng: -63.18111589},
                    {lat: -17.76347293, lng: -63.18053086},
                    {lat: -17.76188110, lng: -63.17986921},
                    {lat: -17.76015913, lng: -63.17922175}
                ]),
                distancia: 15.5,
                tiempo: 45.0,
                id_entidad: entidadOperadora1.id
            }
        });

        // 7. Crear Paradas
        console.log('🚏 Creando paradas...');
        await prisma.parada.createMany({
            data: [
                {
                    nombre: 'Plaza San Francisco',
                    latitud: -17.77360038,
                    longitud: -63.19163402,
                    tiempo: 2.0,
                    id_ruta: ruta1.id
                },
                {
                    nombre: 'Av. Mariscal Santa Cruz',
                    latitud: -17.77352546,
                    longitud: -63.19128195,
                    tiempo: 3.0,
                    id_ruta: ruta1.id
                },
                {
                    nombre: 'Plaza del Estudiante',
                    latitud: -17.77288877,
                    longitud: -63.19063192,
                    tiempo: 2.5,
                    id_ruta: ruta1.id
                }
            ]
        });

        // 8. Crear Micros
        console.log("🚌 Creando micros...");
        const micro1 = await prisma.micro.create({
            data: {
                placa: `LAP-${Math.floor(Math.random() * 10000)}`, // Placa única
                color: 'Azul',
                estado: true,
                id_entidad: entidadOperadora1.id,
                id_ruta: ruta1.id,
                id_empleado: usuarioEmpleado1.empleado?.id
            }
        });

        // 9. Crear Tarjetas para Clientes
        console.log('💳 Creando tarjetas...');
        await prisma.tarjeta.createMany({
            data: [
                {
                    tipo_tarjeta: 'VIRTUAL',
                    nfc_id: `NFC${timestamp}001`, // NFC ID único
                    saldo_actual: 5000.0,
                    id_cliente: usuarioCliente1.cliente.id
                },
                {
                    tipo_tarjeta: 'VIRTUAL',
                    nfc_id: `NFC${timestamp}002`, // NFC ID único
                    saldo_actual: 1000.0,
                    id_cliente: usuarioCliente2.cliente.id
                }
            ]
        });

        console.log('✅ Seed completado exitosamente!');
        console.log(`📊 Datos creados:
        - ${divisas.length} divisas
        - ${criptomonedas.length} criptomonedas
        - 2 entidades operadoras
        - 4 usuarios (2 clientes, 2 empleados)
        - 1 ruta con 3 paradas
        - 1 micro
        - 2 tarjetas`);

    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });