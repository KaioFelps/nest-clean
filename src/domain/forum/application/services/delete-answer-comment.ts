import { Either, left, right } from "@/core/either";
import { IAnswerCommentRepository } from "../repositories/answer-comment-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface IDeleteAnswerCommentService {
  authorId: string;
  answerCommentId: string;
}

type IDeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAnswerCommentService {
  constructor(private answerCommentRepository: IAnswerCommentRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: IDeleteAnswerCommentService): Promise<IDeleteAnswerCommentResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answerComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answerCommentRepository.delete(answerComment);
    return right(null);
  }
}
