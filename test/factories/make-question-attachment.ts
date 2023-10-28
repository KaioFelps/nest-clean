import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IQuestionAttachment,
  QuestionAttachment,
} from "@/domain/forum/enterprise/entities/question-attachment";

export class MakeQuestionAttachmentFactory {
  static execute(
    override: Partial<IQuestionAttachment> = {},
    id?: UniqueEntityId,
  ) {
    const questionattachment = QuestionAttachment.create(
      {
        questionId: new UniqueEntityId(),
        attachmentId: new UniqueEntityId(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return questionattachment;
  }
}
