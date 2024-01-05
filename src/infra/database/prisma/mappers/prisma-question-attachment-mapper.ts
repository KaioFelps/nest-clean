import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Prisma, Attachment as PrismaQuestionAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
  static toDomain(
    prismaQuestionAttachment: PrismaQuestionAttachment,
  ): QuestionAttachment {
    if (!prismaQuestionAttachment.questionId) {
      throw new Error("Invalid attachment type.");
    }

    const domainQuestionAttachment = QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(prismaQuestionAttachment.id),
        questionId: new UniqueEntityId(prismaQuestionAttachment.questionId),
      },
      new UniqueEntityId(prismaQuestionAttachment.id),
    );

    return domainQuestionAttachment;
  }

  static toPrismaUpdateMany(
    domainQuestionAttachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds: string[] = [];

    for (const attachment of domainQuestionAttachments) {
      attachmentIds.push(attachment.attachmentId.toString());
    }

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: domainQuestionAttachments[0].questionId.toString(),
      },
    };
  }

  static toPrismaDeleteMany(
    domainQuestionAttachments: QuestionAttachment[],
  ): Prisma.AttachmentDeleteManyArgs {
    const attachmentIds: string[] = [];

    for (const attachment of domainQuestionAttachments) {
      attachmentIds.push(attachment.attachmentId.toString());
    }

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
    };
  }
}
