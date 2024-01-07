import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  IAnswerAttachment,
  AnswerAttachment,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MakeAnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

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

  async createAndPersist(
    data: Partial<AnswerAttachment> = {},
  ): Promise<AnswerAttachment> {
    const attachment = MakeAnswerAttachmentFactory.execute(data, data.id);

    await this.prisma.attachment.update({
      where: {
        id: attachment.attachmentId.toString(),
      },
      data: {
        answerId: attachment.answerId.toString(),
      },
    });

    return attachment;
  }
}
