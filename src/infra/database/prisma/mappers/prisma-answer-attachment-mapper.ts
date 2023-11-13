import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAnswerAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
  static toDomain(
    prismaAnswerAttachment: PrismaAnswerAttachment,
  ): AnswerAttachment {
    if (!prismaAnswerAttachment.answerId) {
      throw new Error("Invalid attachment type.");
    }

    const domainAnswerAttachment = AnswerAttachment.create({
      attachmentId: new UniqueEntityId(prismaAnswerAttachment.id),
      answerId: new UniqueEntityId(prismaAnswerAttachment.answerId),
    });

    return domainAnswerAttachment;
  }
}
