import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IAnswerComment,
  AnswerComment,
} from "@/domain/forum/enterprise/entities/answer-comment";

export class MakeAnswerCommentFactory {
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
}
