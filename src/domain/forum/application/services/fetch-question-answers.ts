import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { IAnswerRepository } from "../repositories/answer-repository-interface";

interface IFetchQuestionAnswersService {
  page: number;
  questionId: string;
}

type IFetchQuestionAnswersResponse = Either<null, { answers: Answer[] }>;

export class FetchQuestionAnswersService {
  constructor(private answerRepository: IAnswerRepository) {}

  async execute({
    page,
    questionId,
  }: IFetchQuestionAnswersService): Promise<IFetchQuestionAnswersResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({ answers });
  }
}
