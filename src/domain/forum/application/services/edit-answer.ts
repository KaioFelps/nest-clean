import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { IAnswerRepository } from "../repositories/answer-repository-interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { IAnswerAttachmentRepository } from "../repositories/answer-attachment-repository";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface IEditAnswerService {
  authorId: string;
  answerId: string;
  content: string;
  attachmentIds: string[];
}

type IEditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>;

export class EditAnswerService {
  constructor(
    private answerRepository: IAnswerRepository,
    private answerAttachmentRepository: IAnswerAttachmentRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentIds,
  }: IEditAnswerService): Promise<IEditAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }
    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const newAnswerAttachments = attachmentIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      }),
    );

    answerAttachmentList.update(newAnswerAttachments);

    answer.content = content;

    await this.answerRepository.save(answer);

    return right({ answer });
  }
}
