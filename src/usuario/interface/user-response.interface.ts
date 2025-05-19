import { Cliente, Empleado, Usuario } from "@prisma/client";


export interface IResponseUsers{
  users: Usuario[];
  total: number;
}


export interface IResponseUser {
  user: Usuario;
}

export interface IResponseCliente {
  cliente: Cliente & { 
    usuario: Usuario;
    tarjetas?: any[];
  };
}

export interface IResponseEmpleado {
  empleado: Empleado & { 
    usuario: Usuario;
    entidad?: any;
    micros?: any[];
  };
}