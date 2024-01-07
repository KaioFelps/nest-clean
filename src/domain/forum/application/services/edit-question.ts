import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { IQuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { IQuestionAttachmentRepository } from "../repositories/question-attachment-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface IEditQuestionService {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type IEditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

@Injectable()
export class EditQuestionService {
  constructor(
    private questionRepository: IQuestionRepository,
    private questionAttachmentRepository: IQuestionAttachmentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
    title,
    attachmentsIds,
  }: IEditQuestionService): Promise<IEditQuestionResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const newQuestionAttachments: QuestionAttachment[] = [];

    for (const id of attachmentsIds) {
      const attachment = QuestionAttachment.create({
        attachmentId: new UniqueEntityId(id),
        questionId: question.id,
      });

      newQuestionAttachments.push(attachment);
    }

    questionAttachmentList.update(newQuestionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
