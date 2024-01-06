import { IAnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentRepository
  implements IAnswerAttachmentRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    );

    return answerAttachments;
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    );

    this.items = answerAttachments;
  }

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...answerAttachments);
  }

  async deleteMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    const newItems = this.items.filter((item) => {
      return !answerAttachments.some((attachment) => attachment.equals(item));
    });

    this.items = newItems;
  }
}
