import { PaginationParams } from "@/core/repositories/pagination-params";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements IQuestionRepository {
  constructor(private prisma: PrismaService) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({ data });
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyLatest({ page }: PaginationParams): Promise<Question[]> {
    const PER_PAGE = 10;

    const questions = await this.prisma.question.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedQuestions: Question[] = [];

    if (questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        mappedQuestions.push(PrismaQuestionMapper.toDomain(questions[i]));
      }
    }

    return mappedQuestions;
  }
}
