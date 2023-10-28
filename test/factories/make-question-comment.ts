import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IQuestionComment,
  QuestionComment,
} from "@/domain/forum/enterprise/entities/question-comment";

export class MakeQuestionCommentFactory {
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
}
