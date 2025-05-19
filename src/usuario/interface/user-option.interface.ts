import { Prisma } from "@prisma/client";

export interface IOptionUser{
  skip?: number,
  take?: number,
  where?: Prisma.UsuarioWhereInput,
  select?: Prisma.UsuarioSelect,
  orderBy? :Prisma.UsuarioOrderByWithRelationInput,
  cursor?: Prisma.UsuarioWhereUniqueInput,
  distinct?: Prisma.UsuarioScalarFieldEnum | Prisma.UsuarioScalarFieldEnum[],
  include?:   Prisma.UsuarioInclude,
}