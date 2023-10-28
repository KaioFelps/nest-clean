import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { IAnswer, Answer } from "@/domain/forum/enterprise/entities/answer";

export class MakeAnswerFactory {
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
}
