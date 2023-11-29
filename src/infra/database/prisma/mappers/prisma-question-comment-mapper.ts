import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Prisma, Comment as PrismaQuestionComment } from "@prisma/client";

export class PrismaQuestionCommentMapper {
  static toDomain(
    prismaQuestionComment: PrismaQuestionComment,
  ): QuestionComment {
    if (!prismaQuestionComment.questionId) {
      throw new Error("Invalid comment type.");
    }

    const domainQuestionComment = QuestionComment.create(
      {
        authorId: new UniqueEntityId(prismaQuestionComment.authorId),
        content: prismaQuestionComment.content,
        createdAt: prismaQuestionComment.createdAt,
        updatedAt: prismaQuestionComment.updatedAt,
        questionId: new UniqueEntityId(prismaQuestionComment.questionId),
      },
      new UniqueEntityId(prismaQuestionComment.id),
    );

    return domainQuestionComment;
  }

  static toPrisma(
    domainQuestionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    const prismaQuestionComment: Prisma.CommentUncheckedCreateInput = {
      id: domainQuestionComment.id.toString(),
      authorId: domainQuestionComment.authorId.toString(),
      content: domainQuestionComment.content,
      createdAt: domainQuestionComment.createdAt,
      updatedAt: domainQuestionComment.updatedAt,
      questionId: domainQuestionComment.questionId.toString(),
    };

    return prismaQuestionComment;
  }
}
