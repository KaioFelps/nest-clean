import { Either, left, right } from "@/core/either";
import { IQuestionCommentRepository } from "../repositories/question-comment-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface IDeleteQuestionCommentService {
  authorId: string;
  questionCommentId: string;
}

type IDeleteQuestionCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteQuestionCommentService {
  constructor(private questionCommentRepository: IQuestionCommentRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: IDeleteQuestionCommentService): Promise<IDeleteQuestionCommentResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionCommentRepository.delete(questionComment);

    return right(null);
  }
}
