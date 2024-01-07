import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Prisma, Attachment as PrismaAnswerAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
  static toDomain(
    prismaAnswerAttachment: PrismaAnswerAttachment,
  ): AnswerAttachment {
    if (!prismaAnswerAttachment.answerId) {
      throw new Error("Invalid attachment type.");
    }

    const domainAnswerAttachment = AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(prismaAnswerAttachment.id),
        answerId: new UniqueEntityId(prismaAnswerAttachment.answerId),
      },
      new UniqueEntityId(prismaAnswerAttachment.id),
    );

    return domainAnswerAttachment;
  }

  static toPrismaUpdateMany(
    domainAnswerAttachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds: string[] = [];

    for (const attachment of domainAnswerAttachments) {
      attachmentsIds.push(attachment.attachmentId.toString());
    }

    return {
      data: {
        answerId: domainAnswerAttachments[0].answerId.toString(),
      },
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    };
  }

  static toPrismaDeleteMany(
    domainAnswerAttachments: AnswerAttachment[],
  ): Prisma.AttachmentDeleteManyArgs {
    const attachmentsIds: string[] = [];

    for (const attachment of domainAnswerAttachments) {
      attachmentsIds.push(attachment.attachmentId.toString());
    }

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    };
  }
}
