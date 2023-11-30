import { Either, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { IQuestionCommentRepository } from "../repositories/question-comment-repository";
import { Injectable } from "@nestjs/common";

interface IFetchQuestionCommentService {
  page: number;
  questionId: string;
}

type IFetchQuestionCommentResponse = Either<
  null,
  { questionComments: QuestionComment[] }
>;

@Injectable()
export class FetchQuestionCommentService {
  constructor(private questionCommentRepository: IQuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: IFetchQuestionCommentService): Promise<IFetchQuestionCommentResponse> {
    const questionComments =
      await this.questionCommentRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({ questionComments });
  }
}
