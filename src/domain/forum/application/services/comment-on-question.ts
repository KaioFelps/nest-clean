import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { IQuestionRepository } from "../repositories/question-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { IQuestionCommentRepository } from "../repositories/question-comment-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface ICommentOnQuestionService {
  authorId: string;
  questionId: string;
  content: string;
}

type ICommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

@Injectable()
export class CommentOnQuestionService {
  constructor(
    private questionRepository: IQuestionRepository,
    private questionCommentRepository: IQuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
  }: ICommentOnQuestionService): Promise<ICommentOnQuestionResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({ questionComment });
  }
}
