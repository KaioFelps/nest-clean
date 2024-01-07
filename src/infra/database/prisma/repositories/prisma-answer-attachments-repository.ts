import { IAnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements IAnswerAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: { answerId },
    });

    const mappedAttachments: AnswerAttachment[] = [];

    if (mappedAttachments.length > 0) {
      for (let i = 0; i < answerAttachments.length; i++) {
        mappedAttachments.push(
          PrismaAnswerAttachmentMapper.toDomain(answerAttachments[i]),
        );
      }
    }

    return mappedAttachments;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    if (answerAttachments.length < 1) {
      return;
    }

    const data =
      PrismaAnswerAttachmentMapper.toPrismaUpdateMany(answerAttachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    if (answerAttachments.length < 1) {
      return;
    }

    const data =
      PrismaAnswerAttachmentMapper.toPrismaDeleteMany(answerAttachments);

    await this.prisma.attachment.deleteMany(data);
  }
}
