import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Prisma, Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
  static toDomain(prismaQuestion: PrismaQuestion): Question {
    const domainQuestion = Question.create(
      {
        authorId: new UniqueEntityId(prismaQuestion.authorId),
        content: prismaQuestion.content,
        title: prismaQuestion.title,
        createdAt: prismaQuestion.createdAt,
        updatedAt: prismaQuestion.updatedAt,
        bestAnswerId: prismaQuestion.bestAnswerId
          ? new UniqueEntityId(prismaQuestion.bestAnswerId)
          : null,
        slug: Slug.create(prismaQuestion.slug),
      },
      new UniqueEntityId(prismaQuestion.id),
    );

    return domainQuestion;
  }

  static toPrisma(
    domainQuestion: Question,
  ): Prisma.QuestionUncheckedCreateInput {
    const prismaQuestion: Prisma.QuestionUncheckedCreateInput = {
      id: domainQuestion.id.toString(),
      authorId: domainQuestion.authorId.toString(),
      bestAnswerId: domainQuestion.bestAnswerId?.toString(),
      content: domainQuestion.content,
      title: domainQuestion.title,
      slug: domainQuestion.slug.value,
      createdAt: domainQuestion.createdAt,
      updatedAt: domainQuestion.updatedAt,
    };

    return prismaQuestion;
  }
}
