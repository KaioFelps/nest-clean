import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { IAnswerCommentRepository } from "../repositories/answer-comment-repository";

interface IFetchAnswerCommentService {
  page: number;
  answerId: string;
}

type IFetchAnswerCommentResponse = Either<
  null,
  { answerComments: AnswerComment[] }
>;

export class FetchAnswerCommentService {
  constructor(private answerCommentRepository: IAnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: IFetchAnswerCommentService): Promise<IFetchAnswerCommentResponse> {
    const answerComments =
      await this.answerCommentRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({ answerComments });
  }
}
