import { Cliente, Empleado, Usuario } from "@prisma/client";

export interface IAuthResponse {
  user: Usuario;
  token: string;
  cliente?: Cliente & { usuario: Usuario };
  empleado?: Empleado & { usuario: Usuario; entidad?: any };
}

export interface IAuthSignUp{
  user: Usuario;
}