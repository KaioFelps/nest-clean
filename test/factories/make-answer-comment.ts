import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IAnswerComment,
  AnswerComment,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";

@Injectable()
export class MakeAnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  static execute(override: Partial<IAnswerComment> = {}, id?: UniqueEntityId) {
    const answercomment = AnswerComment.create(
      {
        answerId: new UniqueEntityId(),
        authorId: new UniqueEntityId(),
        content: faker.lorem.text(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return answercomment;
  }

  async createAndPersist(
    data: Partial<IAnswerComment> = {},
  ): Promise<AnswerComment> {
    const answercomment = MakeAnswerCommentFactory.execute(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answercomment),
    });

    return answercomment;
  }
}
