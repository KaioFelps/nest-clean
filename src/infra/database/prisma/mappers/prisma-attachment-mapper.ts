import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAttachmentMapper {
  static toPrisma(
    domainAttachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    const prismaAnswer: Prisma.AttachmentUncheckedCreateInput = {
      title: domainAttachment.title,
      url: domainAttachment.url,
      id: domainAttachment.id.toString(),
    };

    return prismaAnswer;
  }

  static toDomain(prismaAttachment: PrismaAttachment): Attachment {
    const domainAttachment = Attachment.create(
      {
        title: prismaAttachment.title,
        url: prismaAttachment.url,
      },
      new UniqueEntityId(prismaAttachment.id),
    );

    return domainAttachment;
  }
}
