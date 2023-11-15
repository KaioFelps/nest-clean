import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { IAnswer, Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";

@Injectable()
export class MakeAnswerFactory {
  constructor(private prisma: PrismaService) {}

  static execute(override: Partial<IAnswer> = {}, id?: UniqueEntityId) {
    const answer = Answer.create(
      {
        authorId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        content: faker.lorem.text(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return answer;
  }

  async createAndPersist(data: Partial<IAnswer> = {}): Promise<IAnswer> {
    const answer = MakeAnswerFactory.execute(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
