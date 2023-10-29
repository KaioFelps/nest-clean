import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  providers: [PrismaService],
  // quando se usa o exports, todo módulo que importar este módulo terá acesso ao que este módulo está exportando
  exports: [PrismaService],
})
export class DatabaseModule {}
