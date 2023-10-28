import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { IQuestionRepository } from "../repositories/question-repository-interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { IQuestionAttachmentRepository } from "../repositories/question-attachment-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface IEditQuestionService {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

type IEditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

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
    attachmentIds,
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

    const newQuestionAttachments = attachmentIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      }),
    );

    questionAttachmentList.update(newQuestionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
