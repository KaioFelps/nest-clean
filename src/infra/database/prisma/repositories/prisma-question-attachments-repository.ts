import { IQuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements IQuestionAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: { questionId },
    });

    const mappedAttachments: QuestionAttachment[] = [];

    if (questionAttachments.length > 0) {
      for (let i = 0; i < questionAttachments.length; i++) {
        mappedAttachments.push(
          PrismaQuestionAttachmentMapper.toDomain(questionAttachments[i]),
        );
      }
    }

    return mappedAttachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length < 1) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length < 1) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaDeleteMany(attachments);

    await this.prisma.attachment.deleteMany(data);
  }
}
