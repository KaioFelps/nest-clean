import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IQuestion,
  Question,
} from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";

@Injectable()
export class MakeQuestionFactory {
  constructor(private prisma: PrismaService) {}

  static execute(override: Partial<IQuestion> = {}, id?: UniqueEntityId) {
    const question = Question.create(
      {
        authorId: new UniqueEntityId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.text(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return question;
  }

  async createAndPersist(data: Partial<IQuestion> = {}): Promise<Question> {
    const question = MakeQuestionFactory.execute(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
