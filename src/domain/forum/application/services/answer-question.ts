import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { IAnswerRepository } from "../repositories/answer-repository";
import { Answer } from "../../enterprise/entities/answer";
import { Either, right } from "@/core/either";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { Injectable } from "@nestjs/common";

interface IAnswerQuestionService {
  authorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
}

type IAnswerQuestionResponse = Either<null, { answer: Answer }>;

@Injectable()
export class AnswerQuestionService {
  constructor(private answerRepository: IAnswerRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: IAnswerQuestionService): Promise<IAnswerQuestionResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityId(authorId),
      content,
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      }),
    );

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);

    return right({ answer });
  }
}
