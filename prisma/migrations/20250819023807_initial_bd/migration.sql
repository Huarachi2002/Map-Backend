-- CreateTable
CREATE TABLE "CriptoMonedas" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CriptoMonedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Divisa" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "pais" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Divisa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(40) NOT NULL,
    "correo" VARCHAR(50) NOT NULL,
    "contrasena" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "tipo" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" UUID NOT NULL,
    "wallet_address" VARCHAR(100) NOT NULL,
    "id_divisa" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" UUID NOT NULL,
    "id_cliente" UUID NOT NULL,
    "accion" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" UUID NOT NULL,
    "id_cliente" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" BOOLEAN NOT NULL DEFAULT false,
    "tipo" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarjeta" (
    "id" UUID NOT NULL,
    "id_cliente" UUID NOT NULL,
    "tipo_tarjeta" VARCHAR(50) NOT NULL,
    "nfc_id" VARCHAR(50),
    "saldo_actual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tarjeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimiento" (
    "id" UUID NOT NULL,
    "id_tarjeta" UUID NOT NULL,
    "monto_cripto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monto_convertido" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tasa_conversion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" UUID NOT NULL,
    "id_tarjeta" UUID NOT NULL,
    "monto_pagado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modo_pago" VARCHAR(50) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "latitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "id_micro" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntidadOperadora" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "correo_contacto" VARCHAR(50) NOT NULL,
    "wallet_address" VARCHAR(100) NOT NULL,
    "saldo_ingresos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "latitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cobro_pasaje" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "id_divisa" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntidadOperadora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" UUID NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "id_entidad" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Micro" (
    "id" UUID NOT NULL,
    "id_entidad" UUID NOT NULL,
    "id_ruta" UUID,
    "id_empleado" UUID,
    "placa" VARCHAR(50) NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Micro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracking" (
    "id" UUID NOT NULL,
    "id_micro" UUID NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "altura" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "precision" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bateria" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imei" VARCHAR(50) NOT NULL,
    "fuente" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntidadPago" (
    "id" UUID NOT NULL,
    "id_pago" UUID NOT NULL,
    "id_entidad" UUID NOT NULL,
    "monto_ingresado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntidadPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parada" (
    "id" UUID NOT NULL,
    "id_ruta" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longitud" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tiempo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "id" UUID NOT NULL,
    "id_entidad" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "origenLat" VARCHAR(50) NOT NULL,
    "origenLong" VARCHAR(50) NOT NULL,
    "destinoLat" VARCHAR(50) NOT NULL,
    "destinoLong" VARCHAR(50) NOT NULL,
    "vertices" TEXT NOT NULL,
    "distancia" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tiempo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetiroEntidad" (
    "id" UUID NOT NULL,
    "id_entidad" UUID NOT NULL,
    "monto_cripto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monto_convertido" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tasa_conversion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetiroEntidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransaccionBlockchain" (
    "id" UUID NOT NULL,
    "id_movimiento" UUID,
    "id_retiro_entidad" UUID,
    "tipo_transaccion" VARCHAR(50) NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "cripto_usada" VARCHAR(30) NOT NULL,
    "monto_original" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gas_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "direccion_origen" VARCHAR(150) NOT NULL,
    "direccion_destino" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransaccionBlockchain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CriptoMonedas_id_key" ON "CriptoMonedas"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CriptoMonedas_nombre_key" ON "CriptoMonedas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CriptoMonedas_simbolo_key" ON "CriptoMonedas"("simbolo");

-- CreateIndex
CREATE UNIQUE INDEX "Divisa_id_key" ON "Divisa"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Divisa_nombre_key" ON "Divisa"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Divisa_simbolo_key" ON "Divisa"("simbolo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_key" ON "Usuario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_id_key" ON "Cliente"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_wallet_address_key" ON "Cliente"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Registro_id_key" ON "Registro"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notificacion_id_key" ON "Notificacion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tarjeta_id_key" ON "Tarjeta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Movimiento_id_key" ON "Movimiento"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_id_key" ON "Pago"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadOperadora_id_key" ON "EntidadOperadora"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadOperadora_wallet_address_key" ON "EntidadOperadora"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_id_key" ON "Empleado"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Micro_id_key" ON "Micro"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_id_key" ON "Tracking"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadPago_id_key" ON "EntidadPago"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Parada_id_key" ON "Parada"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ruta_id_key" ON "Ruta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RetiroEntidad_id_key" ON "RetiroEntidad"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TransaccionBlockchain_id_key" ON "TransaccionBlockchain"("id");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_divisa_fkey" FOREIGN KEY ("id_divisa") REFERENCES "Divisa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarjeta" ADD CONSTRAINT "Tarjeta_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_id_tarjeta_fkey" FOREIGN KEY ("id_tarjeta") REFERENCES "Tarjeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_tarjeta_fkey" FOREIGN KEY ("id_tarjeta") REFERENCES "Tarjeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_micro_fkey" FOREIGN KEY ("id_micro") REFERENCES "Micro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntidadOperadora" ADD CONSTRAINT "EntidadOperadora_id_divisa_fkey" FOREIGN KEY ("id_divisa") REFERENCES "Divisa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Micro" ADD CONSTRAINT "Micro_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Micro" ADD CONSTRAINT "Micro_id_ruta_fkey" FOREIGN KEY ("id_ruta") REFERENCES "Ruta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Micro" ADD CONSTRAINT "Micro_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_id_micro_fkey" FOREIGN KEY ("id_micro") REFERENCES "Micro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntidadPago" ADD CONSTRAINT "EntidadPago_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntidadPago" ADD CONSTRAINT "EntidadPago_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parada" ADD CONSTRAINT "Parada_id_ruta_fkey" FOREIGN KEY ("id_ruta") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetiroEntidad" ADD CONSTRAINT "RetiroEntidad_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaccionBlockchain" ADD CONSTRAINT "TransaccionBlockchain_id_movimiento_fkey" FOREIGN KEY ("id_movimiento") REFERENCES "Movimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaccionBlockchain" ADD CONSTRAINT "TransaccionBlockchain_id_retiro_entidad_fkey" FOREIGN KEY ("id_retiro_entidad") REFERENCES "RetiroEntidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
