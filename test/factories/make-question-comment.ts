import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IQuestionComment,
  QuestionComment,
} from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";

@Injectable()
export class MakeQuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  static execute(
    override: Partial<IQuestionComment> = {},
    id?: UniqueEntityId,
  ) {
    const questioncomment = QuestionComment.create(
      {
        questionId: new UniqueEntityId(),
        authorId: new UniqueEntityId(),
        content: faker.lorem.text(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return questioncomment;
  }

  async createAndPersist(
    data: Partial<IQuestionComment> = {},
  ): Promise<IQuestionComment> {
    const questioncomment = MakeQuestionCommentFactory.execute(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questioncomment),
    });

    return questioncomment;
  }
}
