import { Either, right } from "@/core/either";
import { IAnswerCommentRepository } from "../repositories/answer-comment-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comments-with-author";

interface IFetchAnswerCommentService {
  page: number;
  answerId: string;
}

type IFetchAnswerCommentResponse = Either<
  null,
  { comments: CommentWithAuthor[] }
>;

@Injectable()
export class FetchAnswerCommentService {
  constructor(private answerCommentRepository: IAnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: IFetchAnswerCommentService): Promise<IFetchAnswerCommentResponse> {
    const comments =
      await this.answerCommentRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
