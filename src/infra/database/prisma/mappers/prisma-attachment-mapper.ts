import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma } from "@prisma/client";

export class PrismAttachmentMapper {
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
}
