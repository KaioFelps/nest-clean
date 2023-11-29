import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Prisma, Answer as PrismaAnswer } from "@prisma/client";

export class PrismaAnswerMapper {
  static toDomain(prismaAnswer: PrismaAnswer): Answer {
    const domainAnswer = Answer.create(
      {
        authorId: new UniqueEntityId(prismaAnswer.authorId),
        questionId: new UniqueEntityId(prismaAnswer.questionId),
        content: prismaAnswer.content,
        createdAt: prismaAnswer.createdAt,
        updatedAt: prismaAnswer.updatedAt,
      },
      new UniqueEntityId(prismaAnswer.id),
    );

    return domainAnswer;
  }

  static toPrisma(domainAnswer: Answer): Prisma.AnswerUncheckedCreateInput {
    const prismaAnswer: Prisma.AnswerUncheckedCreateInput = {
      id: domainAnswer.id.toString(),
      authorId: domainAnswer.authorId.toString(),
      questionId: domainAnswer.questionId.toString(),
      content: domainAnswer.content,
      createdAt: domainAnswer.createdAt,
      updatedAt: domainAnswer.updatedAt,
    };

    return prismaAnswer;
  }
}
