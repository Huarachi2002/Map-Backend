import { EntidadOperadora } from "@prisma/client";

export interface IResponseEntidadOperadora {
  entidad: EntidadOperadora & {
    empleados?: any[];
  };
}
