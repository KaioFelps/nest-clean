import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Prisma, Comment as PrismaAnswerComment } from "@prisma/client";

export class PrismaAnswerCommentMapper {
  static toDomain(prismaAnswerComment: PrismaAnswerComment): AnswerComment {
    if (!prismaAnswerComment.answerId) {
      throw new Error("Invalid comment type.");
    }

    const domainAnswerComment = AnswerComment.create(
      {
        authorId: new UniqueEntityId(prismaAnswerComment.authorId),
        content: prismaAnswerComment.content,
        createdAt: prismaAnswerComment.createdAt,
        updatedAt: prismaAnswerComment.updatedAt,
        answerId: new UniqueEntityId(prismaAnswerComment.answerId),
      },
      new UniqueEntityId(prismaAnswerComment.id),
    );

    return domainAnswerComment;
  }

  static toPrisma(
    domainAnswerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    const prismaAnswerComment: Prisma.CommentUncheckedCreateInput = {
      id: domainAnswerComment.id.toString(),
      authorId: domainAnswerComment.authorId.toString(),
      content: domainAnswerComment.content,
      createdAt: domainAnswerComment.createdAt,
      updatedAt: domainAnswerComment.updatedAt,
      answerId: domainAnswerComment.answerId.toString(),
    };

    return prismaAnswerComment;
  }
}
