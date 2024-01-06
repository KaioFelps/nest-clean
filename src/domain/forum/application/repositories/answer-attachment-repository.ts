import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

export abstract class IAnswerAttachmentRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
  abstract createMany(answerAttachments: AnswerAttachment[]): Promise<void>;
  abstract deleteMany(answerAttachments: AnswerAttachment[]): Promise<void>;
}
