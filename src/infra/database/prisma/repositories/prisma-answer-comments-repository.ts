import { PaginationParams } from "@/core/repositories/pagination-params";
import { IAnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comments-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements IAnswerCommentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({ data });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(comment);
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const PER_PAGE = 10;

    const comments = await this.prisma.comment.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        answerId,
      },
    });

    const mappedComments: AnswerComment[] = [];

    if (comments.length > 0) {
      for (let i = 0; i < comments.length; i++) {
        mappedComments.push(PrismaAnswerCommentMapper.toDomain(comments[i]));
      }
    }

    return mappedComments;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const PER_PAGE = 10;

    const comments = await this.prisma.comment.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        answerId,
      },
      include: { author: true },
    });

    const mappedComments: CommentWithAuthor[] = [];

    if (comments.length > 0) {
      for (let i = 0; i < comments.length; i++) {
        mappedComments.push(
          PrismaCommentWithAuthorMapper.toDomain(comments[i]),
        );
      }
    }

    return mappedComments;
  }
}
