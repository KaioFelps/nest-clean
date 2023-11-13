import { PaginationParams } from "@/core/repositories/pagination-params";
import { IQuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements IQuestionCommentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prisma.comment.create({ data });
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    });
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(comment);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const PER_PAGE = 10;

    const comments = await this.prisma.comment.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        questionId,
      },
    });

    const mappedComments: QuestionComment[] = [];

    if (comments.length > 0) {
      for (let i = 0; i < comments.length; i++) {
        mappedComments.push(PrismaQuestionCommentMapper.toDomain(comments[i]));
      }
    }

    return mappedComments;
  }
}
