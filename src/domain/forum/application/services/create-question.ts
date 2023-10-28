import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { IQuestionRepository } from "../repositories/question-repository-interface";
import { Either, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";

interface ICreateQuestionService {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type ICreateQuestionResponse = Either<null, { question: Question }>;

export class CreateQuestionService {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: ICreateQuestionService): Promise<ICreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      content,
      title,
    });

    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      }),
    );

    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionRepository.create(question);

    return right({ question });
  }
}
