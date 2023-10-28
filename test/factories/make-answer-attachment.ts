import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IAnswerAttachment,
  AnswerAttachment,
} from "@/domain/forum/enterprise/entities/answer-attachment";

export class MakeAnswerAttachmentFactory {
  static execute(
    override: Partial<IAnswerAttachment> = {},
    id?: UniqueEntityId,
  ) {
    const answerattachment = AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(),
        attachmentId: new UniqueEntityId(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return answerattachment;
  }
}
