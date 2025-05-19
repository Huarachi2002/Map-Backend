import { Cliente, Empleado, Usuario } from "@prisma/client";

export interface IAuthResponse {
  user: Usuario;
  token: string;
  clienteInfo?: Cliente & { usuario: Usuario };
  empleadoInfo?: Empleado & { usuario: Usuario; entidad?: any };
}

export interface IAuthSignUp{
  user: Usuario;
}