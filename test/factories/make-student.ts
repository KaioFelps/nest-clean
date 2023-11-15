import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student, IStudent } from "@/domain/forum/enterprise/entities/student";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prisma-students-mapper";

@Injectable()
export class MakeStudentFactory {
  constructor(private prisma: PrismaService) {}

  static execute(override: Partial<IStudent> = {}, id?: UniqueEntityId) {
    const student = Student.create(
      {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return student;
  }

  async createAndPersist(data: Partial<IStudent> = {}): Promise<Student> {
    const student = MakeStudentFactory.execute(data);

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}
