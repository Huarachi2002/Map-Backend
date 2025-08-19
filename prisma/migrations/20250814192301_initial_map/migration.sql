-- CreateTable
CREATE TABLE "public"."CriptoMonedas" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CriptoMonedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Divisa" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "pais" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Divisa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
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
CREATE TABLE "public"."Cliente" (
    "id" UUID NOT NULL,
    "wallet_address" VARCHAR(100) NOT NULL,
    "id_divisa" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Registro" (
    "id" UUID NOT NULL,
    "id_cliente" UUID NOT NULL,
    "accion" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notificacion" (
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
CREATE TABLE "public"."Tarjeta" (
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
CREATE TABLE "public"."Movimiento" (
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
CREATE TABLE "public"."Pago" (
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
CREATE TABLE "public"."EntidadOperadora" (
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
CREATE TABLE "public"."Empleado" (
    "id" UUID NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "id_entidad" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Micro" (
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
CREATE TABLE "public"."Tracking" (
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
CREATE TABLE "public"."EntidadPago" (
    "id" UUID NOT NULL,
    "id_pago" UUID NOT NULL,
    "id_entidad" UUID NOT NULL,
    "monto_ingresado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntidadPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parada" (
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
CREATE TABLE "public"."Ruta" (
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
CREATE TABLE "public"."RetiroEntidad" (
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
CREATE TABLE "public"."TransaccionBlockchain" (
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
CREATE UNIQUE INDEX "CriptoMonedas_id_key" ON "public"."CriptoMonedas"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CriptoMonedas_nombre_key" ON "public"."CriptoMonedas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CriptoMonedas_simbolo_key" ON "public"."CriptoMonedas"("simbolo");

-- CreateIndex
CREATE UNIQUE INDEX "Divisa_id_key" ON "public"."Divisa"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Divisa_nombre_key" ON "public"."Divisa"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Divisa_simbolo_key" ON "public"."Divisa"("simbolo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_key" ON "public"."Usuario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_id_key" ON "public"."Cliente"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_wallet_address_key" ON "public"."Cliente"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Registro_id_key" ON "public"."Registro"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notificacion_id_key" ON "public"."Notificacion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tarjeta_id_key" ON "public"."Tarjeta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Movimiento_id_key" ON "public"."Movimiento"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_id_key" ON "public"."Pago"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadOperadora_id_key" ON "public"."EntidadOperadora"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadOperadora_wallet_address_key" ON "public"."EntidadOperadora"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_id_key" ON "public"."Empleado"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Micro_id_key" ON "public"."Micro"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_id_key" ON "public"."Tracking"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadPago_id_key" ON "public"."EntidadPago"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Parada_id_key" ON "public"."Parada"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ruta_id_key" ON "public"."Ruta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RetiroEntidad_id_key" ON "public"."RetiroEntidad"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TransaccionBlockchain_id_key" ON "public"."TransaccionBlockchain"("id");

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_id_divisa_fkey" FOREIGN KEY ("id_divisa") REFERENCES "public"."Divisa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registro" ADD CONSTRAINT "Registro_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notificacion" ADD CONSTRAINT "Notificacion_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tarjeta" ADD CONSTRAINT "Tarjeta_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Movimiento" ADD CONSTRAINT "Movimiento_id_tarjeta_fkey" FOREIGN KEY ("id_tarjeta") REFERENCES "public"."Tarjeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pago" ADD CONSTRAINT "Pago_id_tarjeta_fkey" FOREIGN KEY ("id_tarjeta") REFERENCES "public"."Tarjeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pago" ADD CONSTRAINT "Pago_id_micro_fkey" FOREIGN KEY ("id_micro") REFERENCES "public"."Micro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntidadOperadora" ADD CONSTRAINT "EntidadOperadora_id_divisa_fkey" FOREIGN KEY ("id_divisa") REFERENCES "public"."Divisa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Empleado" ADD CONSTRAINT "Empleado_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Empleado" ADD CONSTRAINT "Empleado_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "public"."EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Micro" ADD CONSTRAINT "Micro_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "public"."EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Micro" ADD CONSTRAINT "Micro_id_ruta_fkey" FOREIGN KEY ("id_ruta") REFERENCES "public"."Ruta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Micro" ADD CONSTRAINT "Micro_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "public"."Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tracking" ADD CONSTRAINT "Tracking_id_micro_fkey" FOREIGN KEY ("id_micro") REFERENCES "public"."Micro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntidadPago" ADD CONSTRAINT "EntidadPago_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "public"."Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntidadPago" ADD CONSTRAINT "EntidadPago_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "public"."EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parada" ADD CONSTRAINT "Parada_id_ruta_fkey" FOREIGN KEY ("id_ruta") REFERENCES "public"."Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ruta" ADD CONSTRAINT "Ruta_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "public"."EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RetiroEntidad" ADD CONSTRAINT "RetiroEntidad_id_entidad_fkey" FOREIGN KEY ("id_entidad") REFERENCES "public"."EntidadOperadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransaccionBlockchain" ADD CONSTRAINT "TransaccionBlockchain_id_movimiento_fkey" FOREIGN KEY ("id_movimiento") REFERENCES "public"."Movimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransaccionBlockchain" ADD CONSTRAINT "TransaccionBlockchain_id_retiro_entidad_fkey" FOREIGN KEY ("id_retiro_entidad") REFERENCES "public"."RetiroEntidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
