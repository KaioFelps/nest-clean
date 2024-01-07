import { Either, right } from "@/core/either";
import { IQuestionCommentRepository } from "../repositories/question-comment-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comments-with-author";

interface IFetchQuestionCommentService {
  page: number;
  questionId: string;
}

type IFetchQuestionCommentResponse = Either<
  null,
  { comments: CommentWithAuthor[] }
>;

@Injectable()
export class FetchQuestionCommentService {
  constructor(private questionCommentRepository: IQuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: IFetchQuestionCommentService): Promise<IFetchQuestionCommentResponse> {
    const comments =
      await this.questionCommentRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
