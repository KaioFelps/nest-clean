import { PaginationParams } from "@/core/repositories/pagination-params";
import { IAnswerRepository } from "@/domain/forum/application/repositories/answer-repository-interface";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";

@Injectable()
export class PrismaAnswersRepository implements IAnswerRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({ data });
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const PER_PAGE = 10;

    const answers = await this.prisma.answer.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedAnswers: Answer[] = [];

    if (answers.length > 0) {
      for (let i = 0; i < answers.length; i++) {
        mappedAnswers.push(PrismaAnswerMapper.toDomain(answers[i]));
      }
    }

    return mappedAnswers;
  }
}
