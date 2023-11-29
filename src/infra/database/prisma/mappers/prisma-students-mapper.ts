import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { Prisma, User as PrismaStudent } from "@prisma/client";

export class PrismaStudentMapper {
  static toDomain(prismaStudent: PrismaStudent): Student {
    const domainStudent = Student.create(
      {
        email: prismaStudent.email,
        name: prismaStudent.name,
        password: prismaStudent.password,
      },
      new UniqueEntityId(prismaStudent.id),
    );

    return domainStudent;
  }

  static toPrisma(domainStudent: Student): Prisma.UserUncheckedCreateInput {
    const prismaStudent: Prisma.UserUncheckedCreateInput = {
      id: domainStudent.id.toString(),
      email: domainStudent.email,
      name: domainStudent.name,
      password: domainStudent.password,
      role: "STUDENT",
    };

    return prismaStudent;
  }
}
