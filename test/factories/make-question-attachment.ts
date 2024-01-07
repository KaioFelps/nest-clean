import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IQuestionAttachment,
  QuestionAttachment,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MakeQuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

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

  async createAndPersist(
    data: Partial<QuestionAttachment> = {},
  ): Promise<QuestionAttachment> {
    const attachment = MakeQuestionAttachmentFactory.execute(data, data.id);

    await this.prisma.attachment.update({
      where: {
        id: attachment.attachmentId.toString(),
      },
      data: {
        questionId: attachment.questionId.toString(),
      },
    });

    return attachment;
  }
}
