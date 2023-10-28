import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IQuestion,
  Question,
} from "@/domain/forum/enterprise/entities/question";

export class MakeQuestionFactory {
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
}
