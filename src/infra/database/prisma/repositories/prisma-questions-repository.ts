import { PaginationParams } from "@/core/repositories/pagination-params";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { IQuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { QuestionWithDetails } from "@/domain/forum/enterprise/entities/value-objects/question-with-details";
import { PrismaQuestionWithDetailsMapper } from "../mappers/prisma-question-with-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { ICacheRepository } from "@/infra/cache/cache-repository";

@Injectable()
export class PrismaQuestionsRepository implements IQuestionRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: ICacheRepository,
    private questionAttachmentRepository: IQuestionAttachmentRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({ data });

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
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

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.questionAttachmentRepository.createMany(
        question.attachments.getNewItems(),
      ),

      this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),

      this.cacheRepository.delete(`question:${data.slug}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
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

  async findBySlugWithDetails(
    slug: string,
  ): Promise<QuestionWithDetails | null> {
    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`);

    if (cacheHit) {
      const cachedData: QuestionWithDetails = JSON.parse(cacheHit);

      return cachedData;
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        attachments: true,
        author: true,
      },
    });

    if (!question) {
      return null;
    }

    const questionDetails = PrismaQuestionWithDetailsMapper.toDomain(question);

    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    );

    return questionDetails;
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
