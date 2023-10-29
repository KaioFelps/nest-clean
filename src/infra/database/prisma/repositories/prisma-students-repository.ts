import { IStudentRepository } from "@/domain/forum/application/repositories/student-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaStudentMapper } from "../mappers/prisma-students-mapper";

@Injectable()
export class PrismaStudentsRepository implements IStudentRepository {
  constructor(private prisma: PrismaService) {}

  async create(student: Student): Promise<void> {
    await this.prisma.user.create({
      data: { ...PrismaStudentMapper.toPrisma(student), role: "STUDENT" },
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    const _user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!_user) {
      return null;
    }

    const user = PrismaStudentMapper.toDomain(_user);

    return user;
  }
}
