import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaQuestionAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
  static toDomain(
    prismaQuestionAttachment: PrismaQuestionAttachment,
  ): QuestionAttachment {
    if (!prismaQuestionAttachment.questionId) {
      throw new Error("Invalid attachment type.");
    }

    const domainQuestionAttachment = QuestionAttachment.create({
      attachmentId: new UniqueEntityId(prismaQuestionAttachment.id),
      questionId: new UniqueEntityId(prismaQuestionAttachment.questionId),
    });

    return domainQuestionAttachment;
  }
}
