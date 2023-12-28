import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { IAttachmentRepository } from "@/domain/forum/application/repositories/attachment-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { PrismAttachmentMapper } from "../mappers/prisma-attachment-mapper";

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: PrismAttachmentMapper.toPrisma(attachment),
    });
  }
}
